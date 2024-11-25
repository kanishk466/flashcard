import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateFlashcard, deleteFlashcard } from "../store/store";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShare,
  FaFileDownload,
  FaPrint,
  FaWhatsapp , FaFacebook , FaInstagram
} from "react-icons/fa";

import jsPDF from "jspdf";

const FlashcardDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const flashcards = useSelector((state) => state.flashcards);
  const flashcard = flashcards[id];
  const [selectedTerm, setSelectedTerm] = useState(null);

  const [showAlert , setShowAlert] = useState(false);

  const formik = useFormik({
    initialValues: {
      termTitle: "",
      definition: "",
      image: "",
    },
    validationSchema: Yup.object({
      termTitle: Yup.string().required("Term title is required"),
      definition: Yup.string().required("Definition is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const updatedTerms = [...flashcard.terms, values];
      const updatedFlashcard = { ...flashcard, terms: updatedTerms };
      dispatch(updateFlashcard({ index: id, updatedFlashcard }));
      resetForm();
      const modal = document.getElementById("addTermModal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
      }
    },
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNextTerm = () => {
    if (selectedTerm !== null && selectedTerm < flashcard.terms.length - 1) {
      setSelectedTerm(selectedTerm + 1);
    }
  };

  const handlePreviousTerm = () => {
    if (selectedTerm !== null && selectedTerm > 0) {
      setSelectedTerm(selectedTerm - 1);
    }
  };



  
  // Generate Share Link
  const generateShareLink = () => {
    return `${window.location.origin}/flashcard/${id}`;
  };

  // Copy to Clipboard
  const handleCopyLink = () => {
    const shareLink = generateShareLink();
    navigator.clipboard.writeText(shareLink);
    setShowAlert(!showAlert);
  };


 // Download Flashcard as PDF
 const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(flashcard.groupTitle, 10, 10);

  // Add description
  doc.setFontSize(12);
  doc.text(flashcard.description, 10, 20);

  // Add terms
  flashcard.terms.forEach((term, index) => {
    const yPosition = 30 + index * 20; // Dynamic positioning
    doc.setFontSize(14);
    doc.text(`Term ${index + 1}: ${term.termTitle}`, 10, yPosition);
    doc.setFontSize(12);
    doc.text(`Definition: ${term.definition}`, 10, yPosition + 10);

    if (term.image) {
      doc.setFontSize(10);
      doc.text("Image URL: " + term.image, 10, yPosition + 20);
    }
  });

  // Save PDF
  doc.save(`${flashcard.groupTitle}.pdf`);
};



  if (!flashcard) {
    return <p className="text-center mt-5">Flashcard not found.</p>;
  }

  return (

 
    <div className="container mt-5">


      <h1 className="mb-4">{flashcard.groupTitle}</h1>
      <p>{flashcard.description}</p>
      <div className="row mt-5">
        {/* Terms List */}
        <div className="col-md-3">
          <div className="list-group">
            {flashcard.terms.map((term, index) => (
              <div key={index} className="d-flex align-items-center">
                <button
                  className={`list-group-item list-group-item-action flex-grow-1 ${
                    selectedTerm === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedTerm(index)}
                >
                  {term.termTitle}
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary mt-3 w-100"
            data-bs-toggle="modal"
            data-bs-target="#addTermModal"
          >
            Add New Term
          </button>
        </div>

        {/* Selected Term Details */}
        <div className="col-md-6">
          <div className="row">
            {selectedTerm !== null ? (
              <div
                className="card shadow p-3"
                style={{
                  height: "400px",
                  overflow: "hidden", // Ensure no unintentional overflow
                }}
              >
                <div className="d-flex h-100">
                  {/* Left Column: Image */}
                  <div
                    className="w-50 d-flex align-items-center justify-content-center"
                    style={{
                      overflow: "hidden", // Prevent image overflow
                    }}
                  >
                    {flashcard.terms[selectedTerm].image ? (
                      <img
                        src={flashcard.terms[selectedTerm].image}
                        alt={flashcard.terms[selectedTerm].termTitle}
                        className="img-fluid"
                        style={{ maxHeight: "90%", objectFit: "contain" }}
                      />
                    ) : (
                      <p>No Image Available</p>
                    )}
                  </div>

                  {/* Right Column: Text */}
                  <div
                    className="w-50 d-flex flex-column justify-content-center ps-3"
                    style={{
                      overflowY: "auto", // Allow scrolling for text content if it overflows
                    }}
                  >
                    <h5
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {flashcard.terms[selectedTerm].termTitle}
                    </h5>
                    <p
                      style={{
                        whiteSpace: "pre-wrap", // Preserve line breaks
                        overflowY: "auto",
                        maxHeight: "120px", // Limit height for scrolling
                      }}
                    >
                      {flashcard.terms[selectedTerm].definition}
                    </p>
                    <p className="text-muted">
                      <strong>Group Title:</strong> {flashcard.groupTitle}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center">Select a term to view details</p>
            )}

            <div className="my-4  d-flex justify-content-center">
              <button
                className="btn  me-2"
                disabled={selectedTerm === 0}
                onClick={() => setSelectedTerm((prev) => prev - 1)}
              >
                <FaArrowLeft />
              </button>

              <span>
                {" "}
                {selectedTerm + 1} /{flashcard.terms.length}
              </span>
              <button
                className="btn ms-2"
                disabled={selectedTerm === flashcard.terms.length - 1}
                onClick={() => setSelectedTerm((prev) => prev + 1)}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <ul class="list-group">
            <li class="list-group-item  mb-3"   data-bs-toggle="modal"
        data-bs-target="#shareModal">
              <FaShare /> Share
            </li>
            <li class="list-group-item   mb-3" onClick={handleDownloadPDF}>
              <FaFileDownload /> DownLoad
            </li>
            <li class="list-group-item   mb-3">
              <FaPrint /> Print
            </li>
          </ul>
        </div>
      </div>

      {/* Add New Term Modal */}
      <div
        className="modal fade"
        id="addTermModal"
        tabIndex="-1"
        aria-labelledby="addTermModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTermModalLabel">
                Add New Term
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="termTitle" className="form-label">
                    Term Title
                  </label>
                  <input
                    type="text"
                    id="termTitle"
                    className={`form-control ${
                      formik.touched.termTitle && formik.errors.termTitle
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("termTitle")}
                  />
                  {formik.touched.termTitle && formik.errors.termTitle && (
                    <div className="invalid-feedback">
                      {formik.errors.termTitle}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="definition" className="form-label">
                    Definition
                  </label>
                  <textarea
                    id="definition"
                    className={`form-control ${
                      formik.touched.definition && formik.errors.definition
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="3"
                    {...formik.getFieldProps("definition")}
                  ></textarea>
                  {formik.touched.definition && formik.errors.definition && (
                    <div className="invalid-feedback">
                      {formik.errors.definition}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image URL (Optional)
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="form-control"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      if (file) {
                        convertToBase64(file).then((base64Image) => {
                          formik.setFieldValue("image", base64Image);
                        });
                      }
                    }}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add Term
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <div
        className="modal fade"
        id="shareModal"
        tabIndex="-1"
        aria-labelledby="shareModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content" >

          {showAlert ? <div class="alert alert-primary" role="alert" >
   Linked Copied successfully
   
</div>: null}
            <div className="modal-header">
              <h5 className="modal-title" id="shareModalLabel">
                Share Flashcard
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Share Link */}
              <div className="mb-3">
                <label htmlFor="shareLink" className="form-label">
                  Shareable Link
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    id="shareLink"
                    className="form-control"
                    value={generateShareLink()}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleCopyLink}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Social Media Buttons */}
              <div className="d-flex justify-content-evenly mt-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    generateShareLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#3b5998" }}
                >
                  <FaFacebook/>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    generateShareLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  <FaWhatsapp/>
                </a>
                <a
                  href={`https://www.instagram.com/?url=${encodeURIComponent(
                    generateShareLink()
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-danger"
                >
                  <FaInstagram/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardDetails;
