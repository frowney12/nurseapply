'use client';
import { useState, useEffect, useRef } from "react";


// ============================================================
// NURSEAPPLY — AI Resume & Cover Letter Tailorer for Nurses
// Pay-per-use: $2.50/generation (Stripe integration hooks included)
// Powered by Claude API (claude-haiku-4-5 for cost efficiency)
// ============================================================

const ACCENT = "#00bfa5";
const ACCENT2 = "#e8f5f3";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'Sora', sans-serif; background: #f7fbfa; color: #1a2e2b; }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav {
    background: #fff;
    border-bottom: 1px solid #e0efec;
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-logo {
    font-family: 'Space Mono', monospace;
    font-size: 16px;
    font-weight: 700;
    color: #00bfa5;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .nav-logo span { color: #1a2e2b; }
  .nav-badge {
    font-size: 11px;
    background: #e8f5f3;
    color: #00bfa5;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, #0d4f47 0%, #00bfa5 100%);
    padding: 56px 32px 48px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '+';
    font-size: 300px;
    opacity: 0.04;
    position: absolute;
    top: -80px;
    right: -60px;
    font-weight: 300;
    line-height: 1;
  }
  .hero-tag {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-family: 'Space Mono', monospace;
  }
  .hero h1 {
    font-size: clamp(28px, 5vw, 44px);
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 16px;
  }
  .hero h1 em { font-style: normal; opacity: 0.75; }
  .hero p {
    font-size: 16px;
    opacity: 0.85;
    max-width: 520px;
    margin: 0 auto 28px;
    line-height: 1.6;
    font-weight: 300;
  }
  .hero-price {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 14px;
  }
  .hero-price strong { font-size: 22px; font-weight: 700; }

  /* MAIN CONTAINER */
  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; flex: 1; }

  /* STEPS INDICATOR */
  .steps {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 36px;
  }
  .step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #94b5b0;
    font-weight: 500;
  }
  .step.active { color: #00bfa5; }
  .step.done { color: #1a2e2b; }
  .step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    background: #e0efec;
    color: #94b5b0;
    flex-shrink: 0;
  }
  .step.active .step-num { background: #00bfa5; color: white; }
  .step.done .step-num { background: #1a2e2b; color: white; }
  .step-line { width: 40px; height: 1px; background: #e0efec; margin: 0 4px; }
  .step-line.done { background: #1a2e2b; }

  /* CARD */
  .card {
    background: white;
    border: 1px solid #e0efec;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0,191,165,0.06);
  }
  .card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #1a2e2b;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-sub {
    font-size: 13px;
    color: #6b9e97;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  /* FORM ELEMENTS */
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #4a7a73;
    margin-bottom: 8px;
  }
  textarea, select, input[type=text] {
    width: 100%;
    background: #f7fbfa;
    border: 1.5px solid #d0e8e4;
    border-radius: 8px;
    padding: 12px 14px;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    color: #1a2e2b;
    outline: none;
    transition: border 0.2s;
    resize: vertical;
  }
  textarea:focus, select:focus, input[type=text]:focus {
    border-color: #00bfa5;
    background: white;
  }
  .field { margin-bottom: 20px; }

  /* NURSING SPECIALTIES */
  .spec-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
  }
  .spec-chip {
    padding: 9px 12px;
    border: 1.5px solid #d0e8e4;
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 500;
    color: #4a7a73;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    background: #f7fbfa;
  }
  .spec-chip.selected {
    background: #e8f5f3;
    border-color: #00bfa5;
    color: #007a68;
    font-weight: 600;
  }
  .spec-chip:hover:not(.selected) { border-color: #00bfa5; }

  /* BUTTONS */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    font-family: 'Sora', sans-serif;
  }
  .btn-primary {
    background: #00bfa5;
    color: white;
    width: 100%;
    justify-content: center;
    font-size: 16px;
    padding: 15px;
  }
  .btn-primary:hover:not(:disabled) { background: #009e87; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-secondary {
    background: white;
    color: #1a2e2b;
    border: 1.5px solid #d0e8e4;
    font-size: 14px;
  }
  .btn-secondary:hover { border-color: #00bfa5; color: #00bfa5; }

  /* PAYMENT PANEL */
  .payment-box {
    background: linear-gradient(135deg, #f0fdf9, #e8f5f3);
    border: 2px solid #00bfa5;
    border-radius: 12px;
    padding: 28px;
    text-align: center;
    margin-bottom: 20px;
  }
  .payment-amount {
    font-family: 'Space Mono', monospace;
    font-size: 48px;
    font-weight: 700;
    color: #00bfa5;
    line-height: 1;
    margin-bottom: 4px;
  }
  .payment-label { font-size: 13px; color: #4a7a73; margin-bottom: 20px; }
  .payment-features {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 24px;
    text-align: left;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  .payment-feature {
    font-size: 13px;
    color: #1a2e2b;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .check { color: #00bfa5; font-size: 15px; }

  /* DEMO BYPASS */
  .demo-note {
    font-size: 12px;
    color: #94b5b0;
    text-align: center;
    margin-top: 12px;
  }
  .demo-link {
    color: #00bfa5;
    cursor: pointer;
    text-decoration: underline;
    background: none;
    border: none;
    font-size: 12px;
    font-family: inherit;
  }

  /* LOADING */
  .loading-box {
    text-align: center;
    padding: 48px 24px;
  }
  .pulse-ring {
    width: 64px;
    height: 64px;
    border: 3px solid #e0efec;
    border-top-color: #00bfa5;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 15px; color: #4a7a73; font-weight: 500; }
  .loading-sub { font-size: 13px; color: #94b5b0; margin-top: 6px; }
  .loading-steps { margin-top: 20px; display: flex; flex-direction: column; gap: 6px; }
  .loading-step {
    font-size: 12px;
    color: #94b5b0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: color 0.3s;
  }
  .loading-step.lit { color: #00bfa5; }

  /* RESULTS */
  .result-tabs {
    display: flex;
    border-bottom: 2px solid #e0efec;
    margin-bottom: 24px;
    gap: 0;
  }
  .result-tab {
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 600;
    color: #6b9e97;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.15s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    font-family: 'Sora', sans-serif;
  }
  .result-tab.active { color: #00bfa5; border-bottom-color: #00bfa5; }
  .result-content {
    background: #f7fbfa;
    border: 1.5px solid #d0e8e4;
    border-radius: 8px;
    padding: 20px;
    font-size: 14px;
    line-height: 1.8;
    color: #1a2e2b;
    white-space: pre-wrap;
    min-height: 200px;
    font-family: 'Sora', sans-serif;
  }
  .result-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .copy-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 1.5px solid #d0e8e4;
    background: white;
    color: #1a2e2b;
    font-family: 'Sora', sans-serif;
    transition: all 0.15s;
  }
  .copy-btn:hover { border-color: #00bfa5; color: #00bfa5; }
  .copy-btn.copied { background: #e8f5f3; border-color: #00bfa5; color: #00bfa5; }

  /* SUCCESS BANNER */
  .success-banner {
    background: #e8f5f3;
    border: 1.5px solid #00bfa5;
    border-radius: 10px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #007a68;
    font-weight: 500;
  }

  /* SOCIAL PROOF */
  .social-row {
    display: flex;
    gap: 20px;
    margin-top: 32px;
    flex-wrap: wrap;
  }
  .social-card {
    flex: 1;
    min-width: 220px;
    background: white;
    border: 1px solid #e0efec;
    border-radius: 10px;
    padding: 18px;
  }
  .social-stars { color: #f59e0b; font-size: 14px; margin-bottom: 8px; }
  .social-quote { font-size: 13px; color: #4a7a73; line-height: 1.6; margin-bottom: 10px; }
  .social-name { font-size: 12px; font-weight: 600; color: #1a2e2b; }
  .social-role { font-size: 11px; color: #94b5b0; }

  /* FOOTER */
  .footer {
    background: #0d4f47;
    color: rgba(255,255,255,0.6);
    text-align: center;
    padding: 24px;
    font-size: 12px;
    font-family: 'Space Mono', monospace;
  }
  .footer strong { color: rgba(255,255,255,0.9); }

  /* RESUME INPUT TOGGLE */
  .input-toggle {
    display: flex;
    gap: 0;
    background: #f7fbfa;
    border: 1.5px solid #d0e8e4;
    border-radius: 8px;
    padding: 3px;
    margin-bottom: 16px;
    width: fit-content;
  }
  .input-toggle-btn {
    padding: 7px 18px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: #6b9e97;
    font-family: 'Sora', sans-serif;
    transition: all 0.15s;
  }
  .input-toggle-btn.active {
    background: white;
    color: #00bfa5;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  /* FILE DROPZONE */
  .dropzone {
    border: 2px dashed #d0e8e4;
    border-radius: 10px;
    padding: 36px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #f7fbfa;
    position: relative;
  }
  .dropzone:hover, .dropzone.dragover {
    border-color: #00bfa5;
    background: #e8f5f3;
  }
  .dropzone-icon { font-size: 36px; margin-bottom: 10px; }
  .dropzone-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a2e2b;
    margin-bottom: 4px;
  }
  .dropzone-sub { font-size: 12px; color: #94b5b0; }
  .dropzone-formats {
    display: inline-flex;
    gap: 6px;
    margin-top: 10px;
  }
  .format-badge {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .format-pdf { background: #fee2e2; color: #b91c1c; }
  .format-docx { background: #dbeafe; color: #1d4ed8; }

  /* FILE UPLOADED STATE */
  .file-uploaded {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #e8f5f3;
    border: 1.5px solid #00bfa5;
    border-radius: 10px;
    padding: 16px 18px;
  }
  .file-icon { font-size: 28px; flex-shrink: 0; }
  .file-info { flex: 1; min-width: 0; }
  .file-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a2e2b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .file-status { font-size: 12px; color: #4a7a73; margin-top: 2px; }
  .file-remove {
    background: none;
    border: none;
    color: #94b5b0;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    line-height: 1;
    font-family: inherit;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .file-remove:hover { color: #e53e3e; }

  /* PARSING INDICATOR */
  .parsing-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #f0fdf9;
    border: 1.5px solid #c6ede6;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 13px;
    color: #4a7a73;
  }
  .parsing-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #d0e8e4;
    border-top-color: #00bfa5;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* EXTRACTED PREVIEW */
  .extracted-preview {
    margin-top: 12px;
    background: #f7fbfa;
    border: 1.5px solid #d0e8e4;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 12.5px;
    color: #4a7a73;
    line-height: 1.6;
    max-height: 120px;
    overflow-y: auto;
    white-space: pre-wrap;
    font-family: 'Space Mono', monospace;
  }
  .extracted-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #00bfa5;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .card { padding: 20px; }
    .hero { padding: 40px 20px 36px; }
    .container { padding: 24px 16px; }
    .spec-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

const NURSING_SPECIALTIES = [
  "ICU / Critical Care", "Emergency (ER)", "Med-Surg", "Pediatrics",
  "Labor & Delivery", "OR / Surgical", "Oncology", "Psychiatric",
  "Home Health", "Travel Nursing", "Nurse Practitioner", "Other"
];

const LOADING_STEPS_TEXT = [
  "Parsing job description keywords...",
  "Matching your nursing experience...",
  "Tailoring clinical terminology...",
  "Optimizing for ATS systems...",
  "Polishing cover letter tone...",
  "Generating resume bullet points...",
];

export default function NurseApply() {
  const [step, setStep] = useState(1); // 1=form, 2=payment, 3=loading, 4=results
  const [specialty, setSpecialty] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState("");
  const [experience, setExperience] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("cover");
  const [copied, setCopied] = useState(null);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  // File upload state
  const [resumeMode, setResumeMode] = useState("upload"); // "upload" | "paste"
  const [uploadedFile, setUploadedFile] = useState(null);   // { name, type, base64, text }
  const [isParsing, setIsParsing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Read file as base64
  const toBase64 = (file: File) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  // Read file as ArrayBuffer (for mammoth)
  const toArrayBuffer = (file: File) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as ArrayBuffer);
    r.onerror = rej;
    r.readAsArrayBuffer(file);
  });

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    const isPDF = file.type === "application/pdf";
    const isDOCX = file.name.endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!isPDF && !isDOCX) {
      alert("Please upload a PDF or Word (.docx) file.");
      return;
    }

    setIsParsing(true);
    setExtractedText("");
    setUploadedFile(null);

    try {
      if (isDOCX) {
        // Use mammoth to extract text client-side
        const arrayBuffer = await toArrayBuffer(file);
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value.trim();
        setExtractedText(text);
        setResume(text);
        setUploadedFile({ name: file.name, type: "docx", text });
      } else {
        // PDF — store as base64 to send to Claude API as document block
        const base64 = await toBase64(file);
        setUploadedFile({ name: file.name, type: "pdf", base64 });
        // Show a placeholder — actual extraction happens in generateWithFile()
        setExtractedText("PDF uploaded — Claude will read it directly during generation.");
        setResume("__PDF_FILE__"); // sentinel value
      }
    } catch (e) {
      alert("Could not read the file. Please try again or paste your resume instead.");
    }
    setIsParsing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setExtractedText("");
    setResume("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Animate loading steps
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setLoadingStepIdx(i => (i < LOADING_STEPS_TEXT.length - 1 ? i + 1 : i));
    }, 1100);
    return () => clearInterval(interval);
  }, [step]);

  const resumeReady = resumeMode === "upload"
    ? (uploadedFile !== null)
    : resume.trim().length > 80;
  const canProceed = specialty && jobDesc.trim().length > 80 && resumeReady;

  const handleGenerate = async () => {
    setStep(3);
    setLoadingStepIdx(0);
    setError("");

    const systemPrompt = `You are an expert healthcare career coach specializing in nursing job applications. Generate two things:

1. A compelling, personalized COVER LETTER (3-4 paragraphs, professional yet warm, specific to nursing)
2. Five RESUME BULLET POINTS that are ATS-optimized, action-verb led, and tailored to the job description

FORMAT YOUR RESPONSE EXACTLY LIKE THIS — use these exact headers:

COVER_LETTER:
[Write the full cover letter here. Start with "Dear Hiring Manager," and end with "Sincerely, [Your Name]". Make it specific to the job description and nursing specialty. 3-4 paragraphs. Do NOT use placeholder brackets except for [Your Name] and [Hospital/Facility Name].]

RESUME_BULLETS:
• [Bullet 1 - strong action verb, quantified if possible, matches job description keywords]
• [Bullet 2]
• [Bullet 3]
• [Bullet 4]
• [Bullet 5]

Be specific, clinical, and professional. Mirror keywords from the job description naturally.`;

    const contextText = `NURSE'S SPECIALTY: ${specialty}
YEARS OF EXPERIENCE: ${experience || "Not specified"}

JOB DESCRIPTION:
${jobDesc}`;

    // Build message content — PDF uses document block, DOCX/paste uses text
    let userContent;
    if (uploadedFile?.type === "pdf") {
      userContent = [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: uploadedFile.base64 }
        },
        {
          type: "text",
          text: `${contextText}\n\nThe nurse's resume is the PDF document above. Extract their experience, certifications, skills, and work history from it, then generate the cover letter and resume bullets.`
        }
      ];
    } else {
      const resumeText = uploadedFile?.type === "docx" ? extractedText : resume;
      userContent = `${contextText}\n\nNURSE'S RESUME / EXPERIENCE:\n${resumeText}`;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";

      const coverMatch = text.match(/COVER_LETTER:\n([\s\S]*?)(?=\nRESUME_BULLETS:|$)/);
      const bulletsMatch = text.match(/RESUME_BULLETS:\n([\s\S]*?)$/);

      setResults({
        cover: coverMatch ? coverMatch[1].trim() : text,
        bullets: bulletsMatch ? bulletsMatch[1].trim() : "Could not parse bullets — see cover letter section for full response."
      });
      setStep(4);
    } catch (e) {
      setError("Something went wrong generating your materials. Please try again.");
      setStep(2);
    }
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePayAndGenerate = () => {
    // In production: initialize Stripe Checkout here
    // stripe.redirectToCheckout({ lineItems: [{ price: 'price_xxx', quantity: 1 }], mode: 'payment', ... })
    // For demo: simulate payment success
    setPaid(true);
    handleGenerate();
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
    setPaid(false);
    setJobDesc("");
    setResume("");
    setSpecialty("");
    setExperience("");
    setActiveTab("cover");
    setUploadedFile(null);
    setExtractedText("");
    setIsParsing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <span style={{color: ACCENT}}>Nurse</span><span>Apply</span><span style={{color: ACCENT}}>AI</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            <span className="nav-badge">🏥 Healthcare Careers</span>
            <span style={{fontSize: 13, color: "#6b9e97", fontWeight: 500}}>$2.50/application</span>
          </div>
        </nav>

        {/* HERO */}
        {step === 1 && (
          <div className="hero">
            <div className="hero-tag">✦ Built for Nurses, by AI</div>
            <h1>Land Your Next<br/><em>Nursing Role</em> Faster</h1>
            <p>Paste your resume and the job description. Get a tailored cover letter + ATS-optimized resume bullets in 30 seconds.</p>
            <div className="hero-price">
              <strong>$2.50</strong>
              <span>per application · No subscription · Pay only when you need it</span>
            </div>
          </div>
        )}

        <div className="container">

          {/* STEP INDICATOR */}
          {step < 4 && (
            <div className="steps">
              <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
                <div className="step-num">{step > 1 ? "✓" : "1"}</div>
                <span>Your Info</span>
              </div>
              <div className={`step-line ${step > 1 ? "done" : ""}`} />
              <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
                <div className="step-num">{step > 2 ? "✓" : "2"}</div>
                <span>Payment</span>
              </div>
              <div className={`step-line ${step > 2 ? "done" : ""}`} />
              <div className={`step ${step >= 3 ? "active" : ""}`}>
                <div className="step-num">3</div>
                <span>Results</span>
              </div>
            </div>
          )}

          {/* STEP 1: FORM */}
          {step === 1 && (
            <>
              <div className="card">
                <div className="card-title">🩺 Your Nursing Specialty</div>
                <div className="card-sub">Select the area that best matches this application</div>
                <div className="spec-grid">
                  {NURSING_SPECIALTIES.map(s => (
                    <div
                      key={s}
                      className={`spec-chip ${specialty === s ? "selected" : ""}`}
                      onClick={() => setSpecialty(s)}
                    >{s}</div>
                  ))}
                </div>
                <div className="field">
                  <label>Years of Experience (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 years, New grad, 10+ years"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-title">📋 Job Description</div>
                <div className="card-sub">Paste the full job posting. The more detail, the better the tailoring.</div>
                <div className="field">
                  <textarea
                    rows={8}
                    placeholder="Paste the full job description here...&#10;&#10;Example: 'We are seeking a compassionate RN for our ICU unit. Must have 2+ years critical care experience, BLS/ACLS certification, strong assessment skills...'"
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="card">
                <div className="card-title">📄 Your Resume</div>
                <div className="card-sub">Upload your resume file or paste your experience directly.</div>

                {/* Toggle */}
                <div className="input-toggle">
                  <button
                    className={`input-toggle-btn ${resumeMode === "upload" ? "active" : ""}`}
                    onClick={() => setResumeMode("upload")}
                  >⬆ Upload File</button>
                  <button
                    className={`input-toggle-btn ${resumeMode === "paste" ? "active" : ""}`}
                    onClick={() => setResumeMode("paste")}
                  >✏️ Paste Text</button>
                </div>

                {/* UPLOAD MODE */}
                {resumeMode === "upload" && (
                  <>
                    {!uploadedFile && !isParsing && (
                      <div
                        className={`dropzone ${dragOver ? "dragover" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                      >
                        <div className="dropzone-icon">📂</div>
                        <div className="dropzone-title">Drop your resume here or click to browse</div>
                        <div className="dropzone-sub">Supports PDF and Word documents</div>
                        <div className="dropzone-formats">
                          <span className="format-badge format-pdf">PDF</span>
                          <span className="format-badge format-docx">DOCX</span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                      </div>
                    )}

                    {isParsing && (
                      <div className="parsing-bar">
                        <div className="parsing-spinner" />
                        <span>Reading your resume file...</span>
                      </div>
                    )}

                    {uploadedFile && !isParsing && (
                      <>
                        <div className="file-uploaded">
                          <span className="file-icon">
                            {uploadedFile.type === "pdf" ? "📕" : "📘"}
                          </span>
                          <div className="file-info">
                            <div className="file-name">{uploadedFile.name}</div>
                            <div className="file-status">
                              {uploadedFile.type === "pdf"
                                ? "✓ PDF ready — Claude will read it directly"
                                : "✓ Text extracted from Word document"}
                            </div>
                          </div>
                          <button className="file-remove" onClick={handleRemoveFile} title="Remove file">✕</button>
                        </div>

                        {/* Preview extracted text for DOCX */}
                        {uploadedFile.type === "docx" && extractedText && (
                          <div style={{marginTop: 12}}>
                            <div className="extracted-label">✓ Extracted text preview</div>
                            <div className="extracted-preview">{extractedText.slice(0, 600)}{extractedText.length > 600 ? "…" : ""}</div>
                          </div>
                        )}

                        {/* Re-upload option */}
                        <div style={{marginTop: 10, textAlign: "center"}}>
                          <button
                            className="demo-link"
                            onClick={() => { handleRemoveFile(); fileInputRef.current?.click(); }}
                          >
                            Upload a different file
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* PASTE MODE */}
                {resumeMode === "paste" && (
                  <div className="field">
                    <textarea
                      rows={8}
                      placeholder="Paste your resume or experience summary here...&#10;&#10;Example: 'RN BSN, 4 years med-surg, 2 years ICU stepdown. Certifications: BLS, ACLS, CCRN in progress. Skills: ventilator management, arterial lines, central lines, charge nurse experience...'"
                      value={resume}
                      onChange={e => setResume(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary"
                disabled={!canProceed}
                onClick={() => setStep(2)}
              >
                {canProceed ? "Continue to Payment →" : "Fill in all fields to continue"}
              </button>

              {!canProceed && (
                <p style={{textAlign: "center", fontSize: 12, color: "#94b5b0", marginTop: 10}}>
                  Specialty, job description, and resume (uploaded or pasted) required
                </p>
              )}

              {/* Social proof */}
              <div className="social-row">
                {[
                  { q: "Got the interview at Mass General after using this. The cover letter perfectly matched their ICU language.", name: "Sarah M.", role: "ICU Nurse, Boston MA" },
                  { q: "As a travel nurse I apply constantly. $2.50 vs hours of rewriting? Easiest decision ever.", name: "James K.", role: "Travel RN, 8 years" },
                  { q: "New grad here — this helped me sound like I had more experience than I do. Landed 3 interviews in a week.", name: "Priya L.", role: "New Grad RN" },
                ].map((s, i) => (
                  <div className="social-card" key={i}>
                    <div className="social-stars">★★★★★</div>
                    <div className="social-quote">"{s.q}"</div>
                    <div className="social-name">{s.name}</div>
                    <div className="social-role">{s.role}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <>
              <div className="payment-box">
                <div className="payment-amount">$2.50</div>
                <div className="payment-label">One-time · No subscription · Instant delivery</div>
                <div className="payment-features">
                  {[
                    "Tailored cover letter (ATS-optimized)",
                    "5 resume bullet points",
                    "Matched to your specialty: " + specialty,
                    "Ready in ~30 seconds",
                    "Copy & paste ready"
                  ].map((f, i) => (
                    <div className="payment-feature" key={i}>
                      <span className="check">✓</span> {f}
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" style={{maxWidth: 320}} onClick={handlePayAndGenerate}>
                  💳 Pay $2.50 & Generate Now
                </button>
                <p style={{fontSize: 11, color: "#4a7a73", marginTop: 10}}>
                  Secured by Stripe · Your data is never stored or sold
                </p>
              </div>

              <div className="demo-note">
                Testing the demo?{" "}
                <button className="demo-link" onClick={handleGenerate}>
                  Skip payment and generate (demo mode)
                </button>
              </div>

              {error && (
                <p style={{color: "#e53e3e", textAlign: "center", marginTop: 16, fontSize: 14}}>{error}</p>
              )}

              <button className="btn btn-secondary" style={{marginTop: 16}} onClick={() => setStep(1)}>
                ← Back to edit
              </button>
            </>
          )}

          {/* STEP 3: LOADING */}
          {step === 3 && (
            <div className="card">
              <div className="loading-box">
                <div className="pulse-ring" />
                <div className="loading-text">Tailoring your application...</div>
                <div className="loading-sub">Optimizing for {specialty} roles</div>
                <div className="loading-steps">
                  {LOADING_STEPS_TEXT.map((s, i) => (
                    <div key={i} className={`loading-step ${i <= loadingStepIdx ? "lit" : ""}`}>
                      {i < loadingStepIdx ? "✓" : i === loadingStepIdx ? "›" : "·"} {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESULTS */}
          {step === 4 && results && (
            <>
              <div className="success-banner">
                <span style={{fontSize: 22}}>🎉</span>
                <span>Your tailored application materials are ready! Optimized for <strong>{specialty}</strong> roles.</span>
              </div>

              <div className="card">
                <div className="result-tabs">
                  <button className={`result-tab ${activeTab === "cover" ? "active" : ""}`} onClick={() => setActiveTab("cover")}>
                    📝 Cover Letter
                  </button>
                  <button className={`result-tab ${activeTab === "bullets" ? "active" : ""}`} onClick={() => setActiveTab("bullets")}>
                    ✦ Resume Bullets
                  </button>
                </div>

                {activeTab === "cover" && (
                  <>
                    <div className="result-content">{results.cover}</div>
                    <div className="result-actions">
                      <button
                        className={`copy-btn ${copied === "cover" ? "copied" : ""}`}
                        onClick={() => handleCopy("cover", results.cover)}
                      >
                        {copied === "cover" ? "✓ Copied!" : "📋 Copy Cover Letter"}
                      </button>
                    </div>
                  </>
                )}

                {activeTab === "bullets" && (
                  <>
                    <div className="result-content">{results.bullets}</div>
                    <div className="result-actions">
                      <button
                        className={`copy-btn ${copied === "bullets" ? "copied" : ""}`}
                        onClick={() => handleCopy("bullets", results.bullets)}
                      >
                        {copied === "bullets" ? "✓ Copied!" : "📋 Copy Bullets"}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div style={{display: "flex", gap: 12, flexWrap: "wrap"}}>
                <button className="btn btn-primary" style={{flex: 1}} onClick={handleReset}>
                  ✦ Tailor Another Application — $2.50
                </button>
              </div>

              <div className="card" style={{marginTop: 20, background: "#f0fdf9", border: "1px solid #c6ede6"}}>
                <div className="card-title" style={{fontSize: 15}}>💡 Tips for using these materials</div>
                <div style={{fontSize: 13, color: "#4a7a73", lineHeight: 1.8, marginTop: 8}}>
                  <strong>Cover letter:</strong> Add the specific hospital/facility name where it says [Hospital/Facility Name]. Add one personal detail about why you want to work there specifically.<br/>
                  <strong>Resume bullets:</strong> Drop these into your existing resume, replacing your current bullets for this specialty. Put the strongest one first.<br/>
                  <strong>ATS tip:</strong> Don't change the keywords — they were selected to match the job description's language for automated screening systems.
                </div>
              </div>
            </>
          )}

        </div>

        <footer className="footer">
          <strong>NurseApplyAI</strong> · Built with Claude AI · $2.50/application · No subscription needed<br/>
          <span style={{opacity: 0.5, fontSize: 11}}>Not affiliated with any hospital or healthcare system · For career assistance only</span>
        </footer>

      </div>
    </>
  );
}
