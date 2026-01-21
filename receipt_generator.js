import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export function generaterecipt(data) {
    const receiptsDir=path.join(process.cwd(),"receipts")

    if(!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir,{recursive:true})
    }
    const doc=new PDFDocument({size:"A4",margin:50})

    const fileName=`receipt-${data.TransactionId}.pdf`
    const filePath=path.join(receiptsDir,fileName);

    doc.pipe(fs.createWriteStream(filePath))

    doc.fontSize(20).text("Payment Recipt",{align:"center"})
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Name:${data.name}`)
    doc.text(`Email:${data.email}`)
    doc.text(`Phone:${data.phone}`)
    doc.text(`Transaction ID:${data.TransactionId}`)
    doc.text(`Plan(s):${data.plans.join(", ")}`)
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();
    doc.text("Thank you for subscribing to Moneywise!",
        {
            align:"center"
        }
    )
    doc.end();

    return fileName;

}