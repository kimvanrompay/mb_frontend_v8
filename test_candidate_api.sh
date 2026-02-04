#!/bin/bash

# Test the candidate detail endpoint directly
# Replace YOUR_JWT_TOKEN with your actual token from localStorage

echo "Testing Candidate Detail Endpoint"
echo "=================================="
echo ""

CANDIDATE_ID="fa6526cf-19bc-4d4d-ba1c-32096333267"
API_URL="https://api.meribas.app/api/v1/candidates/$CANDIDATE_ID"

# Get your JWT token from browser localStorage and paste it here
JWT_TOKEN="YOUR_JWT_TOKEN_HERE"

echo "1. Testing with curl..."
echo "Endpoint: $API_URL"
echo ""

curl -v \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL" 2>&1 | tee candidate_error.log

echo ""
echo ""
echo "2. Checking if candidate exists in database..."
echo "   (Ask your backend team to run this SQL query)"
echo ""
echo "   SELECT id, first_name, last_name, email, status, source"
echo "   FROM candidates"
echo "   WHERE id = '$CANDIDATE_ID';"
echo ""
echo ""
echo "3. Check what the backend is trying to serialize..."
echo "   (Ask your backend team to check server logs)"
echo ""
echo "Error details saved to: candidate_error.log"
