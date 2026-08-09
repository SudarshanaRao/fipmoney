/**
 * AML (Anti-Money Laundering Audit Score) Engine
 * 
 * Rules:
 * 1. Default Signup AML Score:
 *    - Unverified / Incomplete KYC: 45 / 100 ("Moderate Risk")
 *    - Verified KYC: 85 / 100 ("Low Risk")
 * 2. KYC Status Change:
 *    - KYC Completed -> Score boosted to 90 / 100 ("Low Risk")
 *    - KYC Rejected -> Score reduced to 35 / 100 ("High Risk")
 * 3. Dynamic Abnormal Activity Penalties:
 *    - Rapid Buy & Sell Cycle (<15 mins): -25 points ("Abnormal Rapid Buy-Sell Turnover")
 *    - Abnormal Bulk Order (>₹2,00,000 or >25g): -20 points ("Abnormal Bulk Order Spike")
 *    - Rapid Velocity (>3 txns in 3 mins): -15 points ("High Transaction Velocity")
 *    - High Value Txn Without Verified KYC (>₹50,000): -30 points ("Unverified KYC High-Value Attempt")
 */

export function getAmlStatus(score) {
  if (score >= 80) return 'Low Risk';
  if (score >= 50) return 'Moderate Risk';
  return 'High Risk';
}

export function initializeUserAml(isKycCompleted = false) {
  const initialScore = isKycCompleted ? 85 : 45;
  return {
    amlScore: initialScore,
    amlStatus: getAmlStatus(initialScore),
    amlFlaggedReasons: [
      {
        reason: isKycCompleted ? 'Initial Account Created (Verified KYC)' : 'Initial Account Created (Pending KYC Verification)',
        timestamp: new Date(),
        penalty: 0
      }
    ]
  };
}

export function updateKycAmlScore(user, isApproved = true) {
  let newScore = user.amlScore !== undefined ? user.amlScore : (user.amtScore !== undefined ? user.amtScore : 45);
  let reasonText = '';

  if (isApproved) {
    newScore = Math.min(100, Math.max(newScore + 40, 85));
    reasonText = 'KYC Document Verification Passed (+40 Trust Bonus)';
  } else {
    newScore = Math.max(10, newScore - 30);
    reasonText = 'KYC Verification Failed / Rejected (-30 Risk Penalty)';
  }

  const newStatus = getAmlStatus(newScore);
  const flaggedReasons = user.amlFlaggedReasons || user.amtFlaggedReasons || [];
  flaggedReasons.push({
    reason: reasonText,
    timestamp: new Date(),
    penalty: isApproved ? 0 : -30
  });

  return {
    amlScore: newScore,
    amlStatus: newStatus,
    amlFlaggedReasons: flaggedReasons
  };
}

export function evaluateTransactionAml(user, txnType, amount = 0, grams = 0) {
  let currentScore = user.amlScore !== undefined ? user.amlScore : (user.amtScore !== undefined ? user.amtScore : (user.isKycCompleted ? 85 : 45));
  const now = new Date();
  const newFlaggedReasons = (user.amlFlaggedReasons || user.amtFlaggedReasons) ? [...(user.amlFlaggedReasons || user.amtFlaggedReasons)] : [];
  let totalPenalty = 0;

  const lastTxnAt = user.lastTxnTimestamp ? new Date(user.lastTxnTimestamp) : null;
  const lastTxnType = user.lastTxnType || '';
  const numAmount = Number(amount) || 0;
  const numGrams = Number(grams) || 0;

  // 1. Rapid Buy & Sell Cycle Trigger (<15 minutes flip)
  if (lastTxnAt && (now.getTime() - lastTxnAt.getTime()) < 15 * 60 * 1000) {
    if ((lastTxnType === 'BUY' && txnType === 'SELL') || (lastTxnType === 'SELL' && txnType === 'BUY')) {
      const penalty = 25;
      totalPenalty += penalty;
      newFlaggedReasons.push({
        reason: `Abnormal Activity: Rapid Buy & Sell Turnover within 15 mins (-${penalty} pts)`,
        timestamp: now,
        penalty: -penalty
      });
    }
  }

  // 2. Abnormal Bulk Order Spike Trigger (>₹2,00,000 or >25g gold)
  if (numAmount >= 200000 || numGrams >= 25) {
    const penalty = 20;
    totalPenalty += penalty;
    newFlaggedReasons.push({
      reason: `Abnormal Activity: Bulk Order Spike detected (₹${numAmount.toLocaleString()} / ${numGrams}g) (-${penalty} pts)`,
      timestamp: now,
      penalty: -penalty
    });
  }

  // 3. High Transaction Velocity Surge Trigger (>3 txns in 3 minutes)
  const recentTimes = user.recentTxnTimes ? user.recentTxnTimes.map(t => new Date(t)) : [];
  const validRecentTimes = recentTimes.filter(t => (now.getTime() - t.getTime()) < 3 * 60 * 1000);
  validRecentTimes.push(now);

  if (validRecentTimes.length >= 3) {
    const penalty = 15;
    totalPenalty += penalty;
    newFlaggedReasons.push({
      reason: `Abnormal Activity: High Transaction Velocity (${validRecentTimes.length} txns in <3 mins) (-${penalty} pts)`,
      timestamp: now,
      penalty: -penalty
    });
  }

  // 4. High Value Transaction Attempt Without Verified KYC (>₹50,000)
  if (!user.isKycCompleted && numAmount >= 50000) {
    const penalty = 30;
    totalPenalty += penalty;
    newFlaggedReasons.push({
      reason: `Abnormal Activity: High Value Transaction (₹${numAmount.toLocaleString()}) without Verified KYC (-${penalty} pts)`,
      timestamp: now,
      penalty: -penalty
    });
  }

  const finalScore = Math.max(5, Math.min(100, currentScore - totalPenalty));
  const finalStatus = getAmlStatus(finalScore);

  return {
    amlScore: finalScore,
    amlStatus: finalStatus,
    amlFlaggedReasons: newFlaggedReasons,
    lastTxnTimestamp: now,
    lastTxnType: txnType,
    recentTxnTimes: validRecentTimes.slice(-10) // Keep last 10
  };
}
