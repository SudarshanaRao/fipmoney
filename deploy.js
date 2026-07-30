import FtpDeploy from 'ftp-deploy';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ftpDeploy = new FtpDeploy();

// ==========================================
// HOSTINGER FTP CONFIGURATION
// ==========================================
const config = {
    // 1. Your Hostinger FTP username (e.g., u123456789)
    user: process.env.FTP_USER,
    
    // 2. Your Hostinger FTP password
    password: process.env.FTP_PASSWORD,
    
    // 3. Your FTP hostname (usually ftp.yourdomain.com or the hostinger IP)
    host: process.env.FTP_HOST || "ftp.yourdomain.com",
    
    port: 21,
    
    // The folder in your project that contains the built files
    localRoot: path.join(__dirname, "dist"),
    
    // The target folder on Hostinger where the files should go
    // If your FTP account is already set to public_html, this should just be "/"
    remoteRoot: "/",
    
    // Upload everything in the localRoot including .htaccess
    include: ["*", "**/*", ".htaccess"],      
    
    // Set to true if you want to wipe the remote folder before uploading
    deleteRemote: false,
    
    // Passive mode is usually required for shared hosting
    forcePasv: true,
    sftp: false,
};

ftpDeploy.on("uploading", function (data) {
    console.log(`Uploading ${data.filename} (${data.transferredFileCount} / ${data.totalFilesCount})`);
});

ftpDeploy.on("upload-error", function (data) {
    console.error(`Error uploading ${data.filename}:`, data.err);
});

console.log(`Starting deployment to ${config.host}...`);

ftpDeploy
    .deploy(config)
    .then((res) => console.log("\n🚀 Deployment finished successfully!"))
    .catch((err) => console.error("\n❌ Deployment failed:", err));
