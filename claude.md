# Heliomark AI - Project Instructions & Documentation

**Platform**: Automated answer sheet evaluation using Google Gemini AI for Indian competitive exams  
**Stack**: Python FastAPI + React + Tailwind + Vercel + EC2 + S3 + Cognito  
**Status**: Operational with UPSC Mains GS2, GPSC Mains Gujarati, CA Foundation Paper 1 deployed

---

## 📋 Configuration Architecture (7-File System)

Each exam subject requires **exactly 7 files** stored in S3: `s3://heliomark-uploads/configs/{exam-folder}/`

### File Structure
```
configs/upsc-mains-gs2/
├── pipeline.yml                    # Evaluation flow & step definitions
├── marks_scheme.json               # Question-to-marks mapping
├── rubric.json                     # Criteria weights & evaluation rules
├── prompts.yaml                    # AI prompts sent to Gemini
├── answer_detection_prompt.yaml    # Locate answers in PDF pages
├── output_format.json              # PDF report structure & sections
└── version.txt                     # Config version number
```

### File Descriptions

**pipeline.yml** - Defines evaluation workflow steps
- Step 1: PDF → Image conversion
- Step 2: Answer detection & location
- Step 3: Answer mapping to questions
- Step 4: AI evaluation via Gemini
- Step 5: PDF report generation

**marks_scheme.json** - Maps questions to marks
```json
{
  "question_1": {"marks": 10, "part_a": 5, "part_b": 5},
  "question_2": {"marks": 15}
}
```

**rubric.json** - Evaluation criteria with weights
```json
{
  "criteria": {
    "knowledge": {"weight": 40, "levels": ["poor", "average", "good", "excellent"]},
    "analysis": {"weight": 30},
    "language": {"weight": 20, "note": "30% for Gujarati, 20% for knowledge-based"},
    "structure": {"weight": 10}
  }
}
```

**prompts.yaml** - Gemini API prompts
- System prompt for role/context
- Evaluation prompt for each criterion
- Language-specific instructions (English/Hindi/Gujarati)

**answer_detection_prompt.yaml** - Identifies answer regions in papers
- Page detection logic
- Answer block localization
- Multi-page answer handling

**output_format.json** - PDF report layout
- Institution name, student info
- Question-wise scores
- Feedback sections
- Overall summary

**version.txt** - Single line version string (e.g., "1.0.0")

---

## 📚 Exam Subjects

### ✅ Deployed Configurations
1. **UPSC Mains GS2** (`configs/upsc-mains-gs2/`)
   - Topics: Indian society, urbanization, social justice, HR/welfare policies
   - Question count: 7 questions × 250 marks
   - Rubric focus: Analytical thinking (40%), essay structure (30%), knowledge (20%), language (10%)

2. **GPSC Mains Gujarati** (`configs/gpsc-mains-gujarati/`)
   - Language: Gujarati medium (proper font rendering required)
   - Question count: Variable (GS1 format)
   - Rubric focus: Knowledge (40%), language quality (30%), analysis (20%), structure (10%)
   - Status: Tested with 26-page PDF evaluation

3. **CA Foundation Paper 1 - Accounting** (`configs/ca-foundation-paper1/`)
   - Focus: Step-wise marking, accounting standards compliance
   - Question count: MCQs + Descriptive questions
   - Rubric focus: Accuracy (50%), methodology (30%), presentation (20%)

### 🔜 Planned Configurations
- **CBSE Physics** → `configs/cbse-physics/`
- **CBSE Chemistry** → `configs/cbse-chemistry/`
- **CBSE Mathematics** → `configs/cbse-mathematics/`
- **CBSE Biology** → `configs/cbse-biology/`
- **GPSC GS1** → `configs/gpsc-gs1/`
- **GPSC GS2** → `configs/gpsc-gs2/`
- **GPSC English Language** → `configs/gpsc-english/`

---

## 🎯 Current Phase & Priorities

**Phase**: Expanding exam subject coverage while completing frontend

### Immediate (Next 2 weeks)
- [ ] Complete frontend pages: **review**, **result**, **settings**
- [ ] Fix Vercel build error on history page (GitHub sync issue)
- [ ] Add CBSE Physics configuration
- [ ] Test with coaching institute batch (20+ papers)

### Short-term (1-2 months)
- [ ] Complete all CBSE subjects (4 papers)
- [ ] Add remaining GPSC papers (GS1, GS2, English)
- [ ] Implement DynamoDB for evaluation history
- [ ] Scale EC2 from t3.small → t3.medium

### Medium-term (3+ months)
- [ ] Dynamic question paper upload for CBSE institutes
- [ ] Git-based config version control
- [ ] Async batch processing (100+ papers per request)
- [ ] Advanced analytics dashboard

---

## 💻 Code Style Rules

### Python Backend
```python
# ✅ DO
def evaluate_answer(paper_id: str, question_num: int) -> dict:
    """Extract and evaluate answer for single question."""
    try:
        answer_text = extract_answer(paper_id, question_num)
        score = call_gemini_api(answer_text)
        return {"score": score, "feedback": "..."}
    except TimeoutError as e:
        logger.error(f"Gemini timeout for {paper_id}: {e}")
        return {"error": "Evaluation timeout - please retry"}

# ❌ DON'T
def eval(pid, qnum):
    # Complex nested logic with unclear purpose
    try:
        result = api.call(extract(pid, qnum))
        return process(result, qnum)
    except:
        pass  # Silent fail

# Rules:
- Use type hints for all functions
- Handle errors gracefully (return meaningful error objects)
- Comments only for non-obvious logic
- Use f-strings: f"Error: {error_msg}"
- Graceful Gemini API timeouts (retry logic, not silent fails)
```

### React Frontend
```jsx
// ✅ DO - Functional components only
export default function EvaluationResult({ paperId, score }) {
  const [loading, setLoading] = useState(false);
  
  const handleDownload = async () => {
    setLoading(true);
    try {
      const pdf = await fetchPDF(paperId);
      downloadFile(pdf);
    } catch (err) {
      console.error("Download failed:", err);
      // Show user-friendly error UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{score}%</h2>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading..." : "Download PDF"}
      </button>
    </div>
  );
}

// ❌ DON'T
class EvaluationResult extends React.Component {
  // Class components - use functions instead
}

// Rules:
- Functional components with hooks (useState, useContext)
- Tailwind core utilities only (no custom CSS)
- Small, focused components
- Comments for complex business logic only
- No wrapper component hell
- Type safety with PropTypes or TypeScript
```

### Error Handling
```
- Never silently fail (no empty catch blocks)
- Return meaningful error to user
- Log detailed errors for debugging
- Handle Gemini API timeouts: implement retry + user notification
```

---

## ⚠️ Infrastructure Constraints & Learnings

### Memory Management
| Instance | RAM | Swap | Max PDF Size |
|----------|-----|------|--------------|
| t3.small (current) | 1GB | 2GB | ~20 pages |
| t3.medium (recommended) | 4GB | 2GB | 50+ pages |

**Learning**: 26-page GPSC PDF caused OOM kill on t3.small. Added 2GB `/swapfile`. For production, upgrade to t3.medium (₹2,500-3,000/month).

### Gemini API Costs
- **Free tier**: Limited RPM, rate throttling
- **Batch processing optimization**: Group evaluations → cost reduction to ₹1,000-2,000 per 1000 papers
- **Paid tier consideration**: For 1000+ papers/month

### Language Support
- **Multi-language**: English, Hindi, Gujarati
- **Font rendering**: Ensure proper TTF fonts in PDF generation (especially Gujarati)
- **Rubric weights vary by language**:
  - Gujarati papers: Language quality 30% (important for native speakers)
  - Knowledge-based exams: Language quality 20%

### Pipeline Performance
5-step evaluation takes ~2-3 min per paper (single paper):
1. PDF → Image (30s)
2. Answer detection (20s)
3. Answer mapping (10s)
4. Gemini evaluation (60-90s)
5. PDF report generation (30s)

**Optimization needed**: Implement async + batch processing for 100+ papers.

---

## 🔧 Development Workflow & Commands

### SSH into EC2
```bash
# From PowerShell (Windows)
ssh -i C:\Users\nirbh\Downloads\heliomark-key.pem ubuntu@13.233.111.136
```

### Check Backend Service Status
```bash
systemctl status heliomark-api
sudo systemctl restart heliomark-api
sudo journalctl -u heliomark-api -f  # Stream logs
```

### Sync Configuration Files to S3
```bash
# From EC2
aws s3 sync /home/ubuntu/heliomark/configs s3://heliomark-uploads/configs/

# Verify upload
aws s3 ls s3://heliomark-uploads/configs/ --recursive
```

### Deploy Frontend Changes
```bash
# Local (Windows) - from C:\root\app_frontend
git add .
git commit -m "Add new subject config"
git push origin main
# Auto-deploys to Vercel (https://heliomark.ai)
```

### Test Configuration Locally (VS Code Python Interactive)
```python
# In VS Code, use interactive mode for cell-by-cell testing
import json
from pipeline.config_loader import load_config

config = load_config("upsc-mains-gs2")
print(config["rubric"])  # Verify weights sum to 100
```

### Add New Subject to Frontend
```bash
# 1. Edit C:\root\app_frontend/src/data/subjects.json
# 2. Add entry with exam_id, folder name, available: true
# 3. Update evaluate/page.tsx to include new board/subject
# 4. Push to GitHub (auto-deploys)
```

---

## 🔐 Credentials & Configuration

### AWS Cognito
```
Region: ap-south-1
Pool ID: ap-south-1_THRttEMgc
Client ID: 408krt51e0fqr0amktjiqvgnbm
Test User: nirbhaygondaliya@gmail.com / Heliomark@123
```

### AWS S3
```
Bucket: heliomark-uploads
Config path: s3://heliomark-uploads/configs/{exam-folder}/
IAM Role: heliomark-ec2-role (attached to EC2)
```

### Google Gemini API
```
Set in EC2: ~/.bashrc export GEMINI_API_KEY=...
Used by: pipeline/runner.py for evaluation
Free tier: Watch rate limits, implement backoff retry
```

### AWS EC2
```
Instance: t3.small (1GB RAM, 2GB swap)
IP: 13.233.111.136
Port: 8000 (FastAPI internal)
HTTPS: api.heliomark.ai (Nginx reverse proxy)
Key: heliomark-key.pem (in C:\Users\nirbh\Downloads\)
Service: systemd (heliomark-api)
```

### GitHub
```
Repo: Nirbhaygondaliya/heliomark-app
Local: C:\root\app_frontend
Frontend: Vercel auto-deploy on push
Backend: Manual systemd restart after S3 config update
```

### Domain & Hosting
```
Frontend: heliomark.ai (via Vercel + Namecheap)
Backend: api.heliomark.ai (EC2 + Nginx)
```

---

## 🚀 Quick Start: Common Tasks

### Task 1: SSH into EC2 & Check Service
```bash
# Windows PowerShell
ssh -i C:\Users\nirbh\Downloads\heliomark-key.pem ubuntu@13.233.111.136

# EC2 terminal (you'll see: ubuntu@ip-...)
systemctl status heliomark-api
sudo systemctl restart heliomark-api

# View recent logs
sudo journalctl -u heliomark-api -n 50 --follow
```

### Task 2: Deploy Frontend Changes (Add New Exam Board)
```bash
# Windows PowerShell - in C:\root\app_frontend
cd C:\root\app_frontend

# Edit frontend files
# Example: src/data/subjects.json - add new exam
# Example: src/app/evaluate/page.tsx - add new board option

git add .
git commit -m "Add CBSE Physics subject configuration"
git push origin main

# Vercel auto-deploys (check https://vercel.com/dashboard)
# Takes 2-3 minutes
```

### Task 3: Add New Subject Configuration
```bash
# Step 1: Prepare 7 files locally
# Create folder: C:\root\app_frontend\configs\cbse-physics\
# Inside: pipeline.yml, marks_scheme.json, rubric.json, etc.

# Step 2: Copy to EC2
scp -i C:\Users\nirbh\Downloads\heliomark-key.pem -r configs/cbse-physics ubuntu@13.233.111.136:/home/ubuntu/heliomark/configs/

# Step 3: SSH to EC2 and sync to S3
ssh -i C:\Users\nirbh\Downloads\heliomark-key.pem ubuntu@13.233.111.136
aws s3 sync /home/ubuntu/heliomark/configs s3://heliomark-uploads/configs/

# Step 4: Update frontend subjects.json with "available": true
# Step 5: Git push frontend changes (auto-deploys)

# Step 6: Test full pipeline with sample paper
```

---

## 🐛 Troubleshooting Guide

### Issue: "OOM Kill" - EC2 crashing during large PDF evaluation
**Symptom**: Backend crashes when evaluating 20+ page PDF, logs show "Killed"
```bash
# Check if OOM happened
dmesg | grep -i "killed process"

# Check swap status
free -h
swapon --show

# Solution: Swap already added (2GB /swapfile)
# Permanent fix: Upgrade to t3.medium (₹2,500-3,000/month)
```

### Issue: "Gemini API Timeout" - Evaluation hangs
**Symptom**: Request times out after 30s during AI evaluation step
```python
# In pipeline/runner.py, ensure retry logic exists:
def call_gemini_with_retry(prompt: str, max_retries: int = 3) -> dict:
    for attempt in range(max_retries):
        try:
            return gemini_client.generate_content(prompt)
        except TimeoutError as e:
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            raise Exception(f"Gemini timeout after {max_retries} retries")
```
**Solution**: Implement batch processing to reduce load. Consider Gemini paid tier.

### Issue: "Invalid Config" - 7-file validation fails
**Symptom**: "KeyError" or "ValueError" when loading config
```bash
# Check file existence
aws s3 ls s3://heliomark-uploads/configs/upsc-mains-gs2/

# Validate JSON syntax
cat configs/upsc-mains-gs2/rubric.json | python -m json.tool

# Ensure all 7 files present
# Ensure version.txt is single line
# Ensure rubric weights sum to 100
```

### Issue: "Vercel Build Error" - Frontend won't deploy
**Symptom**: Vercel shows build error on history page
```bash
# Check local build
cd C:\root\app_frontend
npm run build

# If local works but Vercel fails:
# 1. Ensure all changes committed and pushed
# 2. Check GitHub shows latest changes
# 3. Redeploy in Vercel dashboard
# 4. Check environment variables in Vercel settings

# If persistent:
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Issue: "Frontend can't reach backend" - API 404
**Symptom**: Network tab shows `https://api.heliomark.ai/evaluate` returning 404
```bash
# Check backend is running
ssh -i C:\Users\nirbh\Downloads\heliomark-key.pem ubuntu@13.233.111.136
systemctl status heliomark-api

# Check Nginx routing
sudo cat /etc/nginx/sites-available/default | grep api.heliomark.ai

# Check FastAPI is listening on 8000
sudo netstat -tulpn | grep 8000

# Restart service
sudo systemctl restart heliomark-api
```

### Issue: "Gujarati text not rendering" - Font issues in PDF
**Symptom**: Gujarati characters appear as boxes in PDF output
```bash
# Check fonts installed on EC2
fc-list | grep -i gujarati

# Install required fonts
sudo apt-get install fonts-noto-cjk fonts-noto-devanagari

# Restart backend
sudo systemctl restart heliomark-api
```

### Issue: "S3 Permission Denied" - Can't upload configs
**Symptom**: `aws s3 sync` returns "AccessDenied"
```bash
# Check IAM role attached
aws sts get-caller-identity

# Verify heliomark-ec2-role has s3:PutObject, s3:GetObject
# If missing, request AWS admin to update policy

# Temporary: Use AWS CLI with explicit credentials (NOT recommended)
```

---

## 📝 Notes for Claude (AI Assistant)

When helping with this project:
1. **Respect the 7-file config architecture** - any new subject needs all 7 files
2. **Keep code simple** - no over-engineering, functional React components only
3. **Type hints in Python** - all functions must have return types
4. **Error handling first** - never silent fails, especially for Gemini timeouts
5. **Test config validity** - rubric weights must sum to 100, all files must exist
6. **Remember the environment**: Windows PowerShell ≠ EC2 terminal
7. **Coaching institutes are the audience** - features must reduce evaluation time dramatically

---

## 📞 Support & Resources

- **GitHub**: https://github.com/Nirbhaygondaliya/heliomark-app
- **Frontend**: https://heliomark.ai
- **API Docs**: https://api.heliomark.ai/docs (Swagger)
- **AWS Console**: https://console.aws.amazon.com (ap-south-1 region)
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Last Updated**: February 2026  
**Maintained by**: Nirbhay  
**Questions?** Refer to this file or ask Claude with project context.
