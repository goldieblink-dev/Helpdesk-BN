<?php
/**
 * MySQL Connection Test
 * Place this file in Help-Desk-Backend/ and access via:
 * http://localhost:8000/db-test.php
 */

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Read .env file
$envFile = __DIR__ . '/.env';
$config = array_filter(explode("\n", file_get_contents($envFile)));

$env = [];
foreach ($config as $line) {
    if (empty($line) || strpos($line, '#') === 0) continue;
    [$key, $value] = explode('=', $line, 2);
    $env[trim($key)] = trim($value);
}

// Get database config
$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? 'helpdesk';
$dbUser = $env['DB_USERNAME'] ?? 'root';
$dbPass = $env['DB_PASSWORD'] ?? '';
$dbConn = $env['DB_CONNECTION'] ?? 'mysql';

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MySQL Connection Test - Help Desk System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 700px;
            width: 100%;
            padding: 40px;
        }
        
        h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 28px;
        }
        
        .subtitle {
            color: #718096;
            margin-bottom: 30px;
            font-size: 14px;
        }
        
        .test-section {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .test-section:last-child {
            border-bottom: none;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: auto;
        }
        
        .status-success {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .status-error {
            background: #fed7d7;
            color: #742a2a;
        }
        
        .status-warning {
            background: #feebc8;
            color: #7c2d12;
        }
        
        .config-list {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        
        .config-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        
        .config-key {
            color: #4a5568;
            font-weight: 500;
        }
        
        .config-value {
            color: #667eea;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }
        
        .result-box {
            background: #f7fafc;
            border-left: 4px solid #48bb78;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .result-box.error {
            border-left-color: #f56565;
            color: #742a2a;
        }
        
        .result-box.warning {
            border-left-color: #ed8936;
            color: #7c2d12;
        }
        
        .tables-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        
        .table-item {
            background: #edf2f7;
            border: 1px solid #cbd5e0;
            border-radius: 4px;
            padding: 12px;
            text-align: center;
            font-size: 13px;
            color: #2d3748;
            font-weight: 500;
        }
        
        .data-grid {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 15px;
            font-size: 13px;
        }
        
        .data-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .data-row:last-child {
            border-bottom: none;
        }
        
        .data-label {
            color: #4a5568;
            font-weight: 500;
        }
        
        .data-value {
            color: #667eea;
            font-weight: 600;
        }
        
        .icon {
            width: 20px;
            height: 20px;
            display: inline-block;
        }
        
        .icon-success {
            color: #22543d;
        }
        
        .icon-error {
            color: #742a2a;
        }
        
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #718096;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗄️ MySQL Connection Test</h1>
        <p class="subtitle">Help Desk System Database Verification</p>
        
        <!-- Configuration Section -->
        <div class="test-section">
            <div class="section-title">
                ⚙️ Database Configuration
                <span class="status-badge status-success">LOADED</span>
            </div>
            <div class="config-list">
                <div class="config-item">
                    <span class="config-key">Connection Type:</span>
                    <span class="config-value"><?php echo strtoupper($dbConn); ?></span>
                </div>
                <div class="config-item">
                    <span class="config-key">Host:</span>
                    <span class="config-value"><?php echo $dbHost; ?></span>
                </div>
                <div class="config-item">
                    <span class="config-key">Port:</span>
                    <span class="config-value"><?php echo $dbPort; ?></span>
                </div>
                <div class="config-item">
                    <span class="config-key">Database:</span>
                    <span class="config-value"><?php echo $dbName; ?></span>
                </div>
                <div class="config-item">
                    <span class="config-key">Username:</span>
                    <span class="config-value"><?php echo $dbUser; ?></span>
                </div>
                <div class="config-item">
                    <span class="config-key">Password:</span>
                    <span class="config-value"><?php echo $dbPass ? '••••••' : '(empty)'; ?></span>
                </div>
            </div>
        </div>
        
        <!-- Connection Test -->
        <div class="test-section">
            <div class="section-title">
                🔌 MySQL Connection
                <?php
                    $connected = false;
                    try {
                        $pdo = new PDO(
                            "mysql:host=$dbHost;port=$dbPort",
                            $dbUser,
                            $dbPass,
                            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
                        );
                        $connected = true;
                        echo '<span class="status-badge status-success">✓ CONNECTED</span>';
                    } catch (PDOException $e) {
                        echo '<span class="status-badge status-error">✗ FAILED</span>';
                    }
                ?>
            </div>
            
            <?php if ($connected): ?>
                <div class="result-box">
                    ✓ Successfully connected to MySQL Server
                </div>
            <?php else: ?>
                <div class="result-box error">
                    ✗ Failed to connect to MySQL Server<br>
                    Error: <?php echo $e->getMessage(); ?>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Database Connection Test -->
        <div class="test-section">
            <div class="section-title">
                📦 Database Connection
                <?php
                    $dbConnected = false;
                    try {
                        $pdo = new PDO(
                            "mysql:host=$dbHost;port=$dbPort;dbname=$dbName;charset=utf8mb4",
                            $dbUser,
                            $dbPass,
                            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
                        );
                        $dbConnected = true;
                        echo '<span class="status-badge status-success">✓ CONNECTED</span>';
                    } catch (PDOException $e) {
                        echo '<span class="status-badge status-error">✗ FAILED</span>';
                    }
                ?>
            </div>
            
            <?php if ($dbConnected): ?>
                <div class="result-box">
                    ✓ Successfully connected to database: <strong><?php echo $dbName; ?></strong>
                </div>
                
                <!-- Tables Check -->
                <div style="margin-top: 15px;">
                    <strong style="color: #2d3748; font-size: 14px;">Tables in Database:</strong>
                    <div class="tables-grid">
                        <?php
                            try {
                                $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
                                $expectedTables = ['admin', 'pelapor', 'kategori', 'jenis_permasalahan', 'tiket', 'lampiran', 'users', 'cache', 'jobs'];
                                
                                foreach ($expectedTables as $table) {
                                    $exists = in_array($table, $tables);
                                    $style = $exists ? 'background: #c6f6d5; border-color: #22543d; color: #22543d;' : 'background: #fed7d7; border-color: #742a2a; color: #742a2a;';
                                    $icon = $exists ? '✓' : '✗';
                                    echo "<div class='table-item' style='$style'>$icon $table</div>";
                                }
                            } catch (Exception $e) {
                                echo "<div class='result-box error'>Error fetching tables: " . $e->getMessage() . "</div>";
                            }
                        ?>
                    </div>
                </div>
                
                <!-- Data Count -->
                <div style="margin-top: 20px;">
                    <strong style="color: #2d3748; font-size: 14px;">Records Count:</strong>
                    <div class="data-grid">
                        <?php
                            try {
                                $counts = [];
                                $countTables = ['admin', 'pelapor', 'kategori', 'jenis_permasalahan', 'tiket', 'lampiran'];
                                
                                foreach ($countTables as $table) {
                                    try {
                                        $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
                                        $counts[$table] = $count;
                                    } catch (Exception $e) {
                                        $counts[$table] = 'N/A';
                                    }
                                }
                                
                                foreach ($counts as $table => $count) {
                                    echo "<div class='data-row'>";
                                    echo "<span class='data-label'>$table</span>";
                                    echo "<span class='data-value'>" . (is_numeric($count) ? "$count records" : $count) . "</span>";
                                    echo "</div>";
                                }
                            } catch (Exception $e) {
                                echo "<div class='result-box error'>Error counting records: " . $e->getMessage() . "</div>";
                            }
                        ?>
                    </div>
                </div>
                
            <?php else: ?>
                <div class="result-box error">
                    ✗ Failed to connect to database: <strong><?php echo $dbName; ?></strong><br>
                    Error: <?php echo $e->getMessage(); ?><br><br>
                    <strong>Solutions:</strong><br>
                    1. Create database via phpMyAdmin (http://localhost/phpmyadmin)<br>
                    2. Or run: mysql -u root -e "CREATE DATABASE <?php echo $dbName; ?> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Next Steps -->
        <div class="test-section">
            <div class="section-title">
                📋 Next Steps
            </div>
            <ol style="color: #4a5568; line-height: 1.8;">
                <li>If database not found, create it via phpMyAdmin or MySQL command line</li>
                <li>Run SQL setup script: `helpdesk_mysql_setup.sql`</li>
                <li>Run Laravel migrations: `php artisan migrate:fresh --seed`</li>
                <li>Verify tables created and data loaded</li>
                <li>Start backend: `php artisan serve --port=8000`</li>
                <li>Start frontend: `npm run dev` (in Help-Desk-Frontend)</li>
                <li>Access admin: http://localhost:5173/admin-login</li>
            </ol>
        </div>
        
        <div class="footer">
            <p>🗄️ Help Desk System - MySQL Database Test</p>
            <p>Generated: February 15, 2026</p>
            <p><a href="http://localhost/phpmyadmin" target="_blank" style="color: #667eea;">Open phpMyAdmin</a></p>
        </div>
    </div>
</body>
</html>
