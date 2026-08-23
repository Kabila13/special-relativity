import { jsPDF } from "jspdf";

type ExportSummaryInput = {
  readingProgress: number;
  correctAnswers: number;
  totalQuestions: number;
  frameSpeed: number;
  objectSpeed: number;
  relativisticSpeed: number;
  classicalSpeed: number;
};

const KEY_CONCEPTS = [
  "Reference frames use co-ordinate axes and clocks; inertial frames do not accelerate.",
  "Lorentz transformations describe the same event in two inertial frames.",
  "Relativistic velocity addition keeps light speed invariant.",
  "Proper time and proper length are measured in the rest frame of the relevant clock or object.",
  "In x-ct spacetime diagrams, photon worldlines are 45 degrees and material worldlines remain inside the light cone.",
];

/** Builds and downloads the Chapter 6 study-summary PDF. Pure side effect, kept out of the component tree. */
export function exportStudySummary(input: ExportSummaryInput) {
  const { readingProgress, correctAnswers, totalQuestions, frameSpeed, objectSpeed, relativisticSpeed, classicalSpeed } = input;
  const resultSpeed = `${relativisticSpeed >= 0 ? "+" : ""}${relativisticSpeed.toFixed(3)}c`;
  const classicalSpeedLabel = `${classicalSpeed >= 0 ? "+" : ""}${classicalSpeed.toFixed(2)}c`;

  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setFillColor(7, 17, 29);
  pdf.rect(0, 0, 210, 46, "F");
  pdf.setTextColor(236, 248, 246);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("RELATIVITY OBSERVATORY", 18, 21);
  pdf.setTextColor(140, 229, 228);
  pdf.setFontSize(10);
  pdf.text("CHAPTER 6 - SPECIAL RELATIVITY - LEARNING SUMMARY", 18, 31);
  pdf.setTextColor(16, 36, 50);
  pdf.setFontSize(10);
  pdf.text(`Generated ${new Date().toLocaleDateString()} - Reading progress ${readingProgress}% - Quiz ${correctAnswers}/${totalQuestions}`, 18, 58);
  pdf.setDrawColor(23, 128, 138);
  pdf.line(18, 63, 192, 63);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text("Velocity-addition result", 18, 76);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`Inputs: v = ${frameSpeed >= 0 ? "+" : ""}${frameSpeed.toFixed(2)}c and u' = ${objectSpeed >= 0 ? "+" : ""}${objectSpeed.toFixed(2)}c`, 18, 85);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(15, 101, 112);
  pdf.text(`Relativistic u = ${resultSpeed}`, 18, 97);
  pdf.setTextColor(185, 74, 57);
  pdf.text(`Galilean u' + v = ${classicalSpeedLabel}`, 18, 107);
  pdf.setTextColor(16, 36, 50);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("The relativistic denominator preserves the light limit for valid inputs.", 18, 116);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text("Key Chapter 6 concepts", 18, 132);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  let conceptY = 142;
  KEY_CONCEPTS.forEach((concept, index) => {
    const textLines = pdf.splitTextToSize(`${index + 1}. ${concept}`, 164);
    pdf.text(textLines, 22, conceptY);
    conceptY += textLines.length * 5 + 4;
  });
  pdf.setFillColor(231, 241, 236);
  pdf.roundedRect(18, 228, 174, 31, 3, 3, "F");
  pdf.setTextColor(16, 36, 50);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("Quiz checkpoint", 25, 240);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  pdf.text(`${correctAnswers} of ${totalQuestions} diagnostic concepts answered correctly. Continue from your saved progress in Relativity Observatory.`, 25, 250, { maxWidth: 156 });
  pdf.setTextColor(107, 128, 135);
  pdf.setFontSize(8.5);
  pdf.text("Source-aligned interactive learning summary - Physics for the IB Diploma - Chapter 6", 18, 283);
  pdf.save("relativity-observatory-chapter-6-summary.pdf");
}
