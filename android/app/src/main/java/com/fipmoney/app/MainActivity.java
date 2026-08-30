package com.fipmoney.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Force Android window to fit system windows, completely disabling overlay across all app pages
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
