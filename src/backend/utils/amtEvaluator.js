// Re-export AML evaluator for backward compatibility
export {
  getAmlStatus as getAmtStatus,
  initializeUserAml as initializeUserAmt,
  updateKycAmlScore as updateKycAmtScore,
  evaluateTransactionAml as evaluateTransactionAmt
} from './amlEvaluator.js';
