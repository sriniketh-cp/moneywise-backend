import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export function generaterecipt(data) {
    return new Promise((resolve, reject) => {
        const receiptsDir = path.join(process.cwd(), "receipts");

        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        const fileName = `receipt-${data.TransactionId}.pdf`;
        const filePath = path.join(receiptsDir, fileName);

        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        doc.fontSize(20).text("Payment Receipt", { align: "center" });
        doc.moveDown();

        doc.fontSize(12);
        doc.text(`Name: ${data.name}`);
        doc.text(`Email: ${data.email}`);
        doc.text(`Phone: ${data.phone}`);
        doc.text(`Transaction ID: ${data.TransactionId}`);
        doc.text(`Plan(s): ${data.plans.join(", ")}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);

        doc.moveDown();
        doc.text("Thank you for subscribing to Moneywise!", {
            align: "center",
        });

        doc.end();

        stream.on("finish", () => {
            resolve(fileName);
        });

        stream.on("error", (err) => {
            reject(err);
        });
    });
}
