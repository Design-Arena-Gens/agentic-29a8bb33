'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './styles.css';

export default function Home() {
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const slides = [
    {
      title: "English Literature in Practical Life",
      content: "Discovering the Real-World Value of Literary Studies",
      subtitle: "How stories, poetry, and prose shape our everyday experiences"
    },
    {
      title: "Enhanced Communication Skills",
      content: "Literature expands vocabulary and improves expression",
      points: [
        "Rich vocabulary for professional settings",
        "Persuasive writing abilities",
        "Clear and effective communication",
        "Understanding of tone and context"
      ]
    },
    {
      title: "Emotional Intelligence & Empathy",
      content: "Understanding diverse perspectives through characters",
      points: [
        "Recognizing complex human emotions",
        "Building empathy in relationships",
        "Navigating social situations",
        "Understanding cultural differences"
      ]
    },
    {
      title: "Critical Thinking & Problem-Solving",
      content: "Analyzing narratives develops analytical skills",
      points: [
        "Identifying patterns and themes",
        "Evaluating multiple viewpoints",
        "Making informed decisions",
        "Creative problem-solving approaches"
      ]
    },
    {
      title: "Career Advantages",
      content: "Literary skills translate to professional success",
      points: [
        "Content creation and marketing",
        "Leadership and management",
        "Legal and academic careers",
        "Business communication excellence"
      ]
    }
  ];

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const slideElements = document.querySelectorAll('.slide');

      for (let i = 0; i < slideElements.length; i++) {
        const canvas = await html2canvas(slideElements[i], {
          scale: 2,
          backgroundColor: null,
          logging: false,
          width: 1280,
          height: 720
        });

        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      }

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Also trigger download
      pdf.save('english-literature-benefits.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    setGenerating(false);
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>English Literature Benefits - Presentation</h1>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="generate-btn"
        >
          {generating ? 'Generating PDF...' : 'Generate & Download PDF'}
        </button>
        {pdfUrl && (
          <a
            href={pdfUrl}
            download="english-literature-benefits.pdf"
            className="download-link"
          >
            Click here to download again
          </a>
        )}
      </div>

      <div className="slides-container">
        {slides.map((slide, index) => (
          <div key={index} className="slide" data-slide={index + 1}>
            <div className="zigzag-background"></div>
            <div className="slide-content">
              <div className="slide-number">Slide {index + 1}/5</div>
              <h2 className="slide-title">{slide.title}</h2>
              <p className="slide-main-content">{slide.content}</p>
              {slide.subtitle && (
                <p className="slide-subtitle">{slide.subtitle}</p>
              )}
              {slide.points && (
                <ul className="slide-points">
                  {slide.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
