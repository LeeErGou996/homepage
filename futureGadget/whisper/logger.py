from datetime import datetime
from pathlib import Path

class ConversionLogger:
    def __init__(self):
        self.processed_files = []
        self.failed_files = []
        
    def log_success(self, filename):
        self.processed_files.append(filename)
        
    def log_failure(self, filename, error):
        self.failed_files.append((filename, error))
        
    def save_log(self, log_dir):
        """Save processing results to log file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = log_dir / f'conversion_log_{timestamp}.txt'
        
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write(f"Whisper Voice Conversion Log - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("-" * 80 + "\n\n")
            
            f.write("Successfully processed files:\n")
            for file in self.processed_files:
                f.write(f"✓ {file}\n")
            
            if self.failed_files:
                f.write("\nFailed conversions:\n")
                for file, error in self.failed_files:
                    f.write(f"✗ {file}: {error}\n")
                    
            f.write(f"\nTotal processed: {len(self.processed_files)}")
            f.write(f"\nTotal failed: {len(self.failed_files)}")
            
        return log_file