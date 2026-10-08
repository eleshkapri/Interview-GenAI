const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  const { selfDescription, jobDescription } = req.body;
  const hasResume = Boolean(req.file);

  if (!jobDescription?.trim() || (!hasResume && !selfDescription?.trim())) {
    return res.status(400).json({
      message: "A job description and either a resume or self description are required.",
    });
  }

  let resume = "";
  if (hasResume) {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    resume = resumeContent.text;
  }

  const interViewReportByAi = await generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume,
    selfDescription,
    jobDescription,
    ...interViewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport
  })
}

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({ interviewReports });
}

async function getInterviewReportByIdController(req, res) {
  const interviewReport = await interviewReportModel.findOne({
    _id: req.params.interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  res.status(200).json({ interviewReport });
}

async function generateResumePdfController(req, res) {
  const interviewReport = await interviewReportModel.findOne({
    _id: req.params.interviewReportId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found." });
  }

  const pdfBuffer = await generateResumePdf({
    resume: interviewReport.resume,
    selfDescription: interviewReport.selfDescription,
    jobDescription: interviewReport.jobDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="resume_${interviewReport._id}.pdf"`,
  });
  res.status(200).send(pdfBuffer);
}

module.exports = {
  generateInterViewReportController,
  getAllInterviewReportsController,
  getInterviewReportByIdController,
  generateResumePdfController,
};
