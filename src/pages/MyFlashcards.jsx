import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyFlashcards = () => {
  const flashcards = useSelector((state) => state.flashcards);
  const navigate = useNavigate();

  const handleViewCard = (index) => {
    navigate(`/flashcard/${index}`);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">My Flashcards</h1>
      <div className="row">
        {flashcards.map((flashcard, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">{flashcard.groupTitle}</h5>
                <p className="card-text">{flashcard.description}</p>
                <p className="card-text">
                  <strong>Terms Count:</strong> {flashcard.terms.length}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewCard(index)}
                >
                  View Card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFlashcards;
