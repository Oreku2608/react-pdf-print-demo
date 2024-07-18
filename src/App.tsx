import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const App = () => {
  const [userFullName, setUserFullName] = useState("Luis Fernández");
  const cardRef = useRef<HTMLDivElement>(null);

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserFullName(event.target.value);
  };

  const printPDF: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const card = cardRef.current;
    if (card) {
      const doc = new jsPDF();
      const scale = 3;
      const width = card.offsetWidth * scale;
      const height = card.offsetHeight * scale;

      const canvas = await html2canvas(cardRef.current, {
        scale,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("sample.pdf");
    }
  };

  return (
    <div className="flex items-center min-h-screen">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="space-y-8">
          <div
            ref={cardRef}
            className="w-72 border bg-white border-gray-100 rounded-md shadow-lg p-8 flex flex-col items-center gap-4"
          >
            <img
              src="/avatar.png"
              className="object-cover w-32 h-32 rounded-full"
              alt="Chocolat Avatar"
            />
            <h1 className="text-center font-bold text-lg text-slate-900">
              {userFullName}
            </h1>
            <p className="text-center text-sm text-slate-700">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam
              similique quaerat maiores!
            </p>
          </div>
          <form onSubmit={printPDF}>
            <div className="flex space-x-2">
              <input
                value={userFullName}
                className="inline-flex px-4 h-10 bg-indigo-100 font-medium text-indigo-900 rounded-md text-sm"
                onChange={onNameChange}
              />
              <button
                type="submit"
                className="inline-flex px-4 h-10 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 hover:cursor-pointer font-medium text-indigo-50 rounded-md text-center items-center justify-center text-sm"
              >
                Print
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
