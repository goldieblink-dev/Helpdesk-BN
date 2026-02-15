#!/bin/bash

# Help Desk API Comprehensive Testing Script
# Author: HelpDesk Development Team
# Date: Feb 15, 2026

BASE_URL="http://localhost:8000/api"
RESULTS_FILE="test-results-$(date +%Y%m%d_%H%M%S).txt"
PASS=0
FAIL=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════════════════════════╗" | tee -a $RESULTS_FILE
echo "║         HELP DESK API COMPREHENSIVE TEST SUITE                ║" | tee -a $RESULTS_FILE
echo "║         Date: $(date '+%Y-%m-%d %H:%M:%S')                       ║" | tee -a $RESULTS_FILE
echo "╚════════════════════════════════════════════════════════════════╝" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local auth_token="$5"
    local expected_status="$6"
    
    echo -n "Testing: $name ... " | tee -a $RESULTS_FILE
    
    if [ -z "$auth_token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_token" \
            -d "$data" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [[ "$http_code" == "$expected_status"* ]]; then
        echo -e "${GREEN}PASS${NC} (HTTP $http_code)" | tee -a $RESULTS_FILE
        echo "Response: $body" >> $RESULTS_FILE
        ((PASS++))
    else
        echo -e "${RED}FAIL${NC} (Expected HTTP $expected_status, got $http_code)" | tee -a $RESULTS_FILE
        echo "Response: $body" >> $RESULTS_FILE
        ((FAIL++))
    fi
    echo "" | tee -a $RESULTS_FILE
}

# Check if server is running
echo -e "${YELLOW}Checking server connection...${NC}" | tee -a $RESULTS_FILE
if ! curl -s "$BASE_URL/kategori" > /dev/null 2>&1; then
    echo -e "${RED}❌ Cannot connect to server at $BASE_URL${NC}" | tee -a $RESULTS_FILE
    echo "Make sure to run: php artisan serve --port=8000" | tee -a $RESULTS_FILE
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# =============================================
# 1. AUTHENTICATION TESTS
# =============================================
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}1. AUTHENTICATION TESTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

test_endpoint \
    "Login with valid credentials" \
    "POST" \
    "/admin/login" \
    '{"username":"admin","password":"admin123"}' \
    "" \
    "200"

# Save token for further tests
TOKEN=$(curl -s -X POST "$BASE_URL/admin/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}' | jq -r '.token' 2>/dev/null)

echo "Extracted Token: $TOKEN" | tee -a $RESULTS_FILE

test_endpoint \
    "Login with invalid password" \
    "POST" \
    "/admin/login" \
    '{"username":"admin","password":"wrongpass"}' \
    "" \
    "401"

test_endpoint \
    "Verify token (valid)" \
    "GET" \
    "/admin/verify-token" \
    "" \
    "$TOKEN" \
    "200"

test_endpoint \
    "Get admin profile" \
    "GET" \
    "/admin/profile" \
    "" \
    "$TOKEN" \
    "200"

test_endpoint \
    "Logout" \
    "POST" \
    "/admin/logout" \
    "" \
    "$TOKEN" \
    "200"

# =============================================
# 2. KATEGORI TESTS
# =============================================
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}2. KATEGORI TESTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

test_endpoint \
    "Get all categories" \
    "GET" \
    "/kategori" \
    "" \
    "" \
    "200"

test_endpoint \
    "Get category by slug (server)" \
    "GET" \
    "/kategori/by-slug/server" \
    "" \
    "" \
    "200"

test_endpoint \
    "Get jenis permasalahan for kategori 1" \
    "GET" \
    "/kategori/1/jenis" \
    "" \
    "" \
    "200"

test_endpoint \
    "Get single category (id=1)" \
    "GET" \
    "/kategori/1" \
    "" \
    "" \
    "200"

# =============================================
# 3. TIKET TESTS
# =============================================
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}3. TIKET TESTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Note: Multipart form-data testing is more complex in bash
# We'll test JSON endpoints for now

test_endpoint \
    "Get all tickets" \
    "GET" \
    "/tikets" \
    "" \
    "" \
    "200"

test_endpoint \
    "Get ticket statistics" \
    "GET" \
    "/tikets/stats/report" \
    "" \
    "" \
    "200"

test_endpoint \
    "Search tickets by phone (081234567890)" \
    "GET" \
    "/tikets/search/by-phone/081234567890" \
    "" \
    "" \
    "200"

# =============================================
# 4. SUMMARY
# =============================================
echo "" | tee -a $RESULTS_FILE
echo "╔════════════════════════════════════════════════════════════════╗" | tee -a $RESULTS_FILE
echo "║                        TEST SUMMARY                           ║" | tee -a $RESULTS_FILE
echo "║────────────────────────────────────────────────────────────────║" | tee -a $RESULTS_FILE
printf "║ %-60s ║\n" "Total Tests: $((PASS + FAIL))" | tee -a $RESULTS_FILE
printf "║ %-60s ║\n" "Passed: ${GREEN}$PASS${NC}" | tee -a $RESULTS_FILE
printf "║ %-60s ║\n" "Failed: ${RED}$FAIL${NC}" | tee -a $RESULTS_FILE
echo "║────────────────────────────────────────────────────────────────║" | tee -a $RESULTS_FILE

if [ $FAIL -eq 0 ]; then
    echo -e "║ ${GREEN}✓ ALL TESTS PASSED!${NC}                                      ║" | tee -a $RESULTS_FILE
else
    echo -e "║ ${RED}✗ Some tests failed. Check $RESULTS_FILE${NC}   ║" | tee -a $RESULTS_FILE
fi

echo "╚════════════════════════════════════════════════════════════════╝" | tee -a $RESULTS_FILE

echo "" | tee -a $RESULTS_FILE
echo "Detailed results saved to: $RESULTS_FILE" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

exit $([ $FAIL -eq 0 ] && echo 0 || echo 1)
