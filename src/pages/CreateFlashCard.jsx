import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addFlashcard, deleteFlashcard } from "../store/store";

import { Formik, Form, Field, FieldArray, replace } from "formik";
import { FaTrash } from "react-icons/fa";
import * as Yup from "yup";

const CreateFlashCard = () => {
  const dispatch = useDispatch();
  const flashcards = useSelector((state) => state.flashcards);
  const [isMainFormValid, setIsMainFormValid] = useState(false);

  const validationSchema = Yup.object().shape({
    groupTitle: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    terms: Yup.array().of(
      Yup.object().shape({
        termTitle: Yup.string().required("Term title is required"),
        definition: Yup.string().required("Definition is required"),
      })
    ),
  });

  const handleSubmit = (values, { resetForm }) => {
    dispatch(addFlashcard(values));
    resetForm();
    setIsMainFormValid(false);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Create Flashcard</h1>
      <Formik
        initialValues={{
          groupTitle: "",
          image: "",
          description: "",
          terms: [{ termTitle: "", definition: "", image: "" }],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, validateForm , setFieldValue }) => (
          <Form className="p-4 shadow rounded bg-light">
            {/* Main Flashcard Form */}
            <div className="mb-4">
              <h4>Main Flashcard</h4>
              <div className="form-group mb-3">
                <label>Title</label>
                <Field
                  name="groupTitle"
                  placeholder="Enter title"
                  className={`form-control ${
                    errors.groupTitle && touched.groupTitle ? "is-invalid" : ""
                  }`}
                  onBlur={() =>
                    validateForm().then((errors) => {
                      setIsMainFormValid(Object.keys(errors).length === 0);
                    })
                  }
                />
                {errors.groupTitle && touched.groupTitle && (
                  <div className="invalid-feedback">{errors.groupTitle}</div>
                )}
              </div>
              <div className="form-group mb-3">
                <label>Image (Optional)</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file) {
                      convertToBase64(file).then((base64Image) => {
                        setFieldValue("image", base64Image);
                      });
                    }
                  }}
                />


{values.image && (
                  <img
                    src={values.image}
                    alt="Preview"
                    className="img-thumbnail mt-3"
                    style={{ maxHeight: "150px" }}
                  />
                )}
              </div>
              <div className="form-group mb-3">
                <label>Description</label>
                <Field
                  name="description"
                  placeholder="Enter description"
                  as="textarea"
                  className={`form-control ${
                    errors.description && touched.description
                      ? "is-invalid"
                      : ""
                  }`}
                  onBlur={() =>
                    validateForm().then((errors) => {
                      setIsMainFormValid(Object.keys(errors).length === 0);
                    })
                  }
                />
                {errors.description && touched.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>
            </div>

            {/* Terms Form */}
            <div className={`mb-4 ${isMainFormValid ? "" : "blurred"}`}>
              <h4>Terms</h4>
              <FieldArray name="terms">
                {({ push, remove, replace }) => (
                  <div>
                    {values.terms.map((term, index) => (
                      <div key={index} className="row g-3 mb-3 align-items-end">
                        <div className="col-md-4">
                          <label>Term</label>
                          <Field
                            name={`terms.${index}.termTitle`}
                            placeholder="Enter term"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Definition</label>
                          <Field
                            name={`terms.${index}.definition`}
                            placeholder="Enter definition"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-3">
                          <label>Image (Optional)</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(event) => {
                              const file = event.target.files[0];
                              if (file) {
                                convertToBase64(file).then((base64Image) => {
                                  setFieldValue(
                                    `terms.${index}.image`,
                                    base64Image
                                  );
                                });
                              }
                            }}
                          />

{term.image && (
                            <img
                              src={term.image}
                              alt="Preview"
                              className="img-thumbnail mt-2"
                              style={{ maxHeight: "100px" }}
                            />
                          )}
                        </div>
                        <div className="col-md-1 text-center">
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => remove(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={() =>
                        push({ termTitle: "", definition: "", image: "" })
                      }
                      disabled={!isMainFormValid}
                    >
                      Add More
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success">
                Create Flashcard
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Display Saved Flashcards */}
      <div className="mt-5">
        <h4>Saved Flashcards</h4>
        {flashcards.map((flashcard, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{flashcard.groupTitle}</h5>
              <p className="card-text">{flashcard.description}</p>
              {flashcard.image && (
                <img
                  src={flashcard.image}
                  alt="Flashcard"
                  className="img-fluid mb-2"
                  style={{ maxHeight: "150px" }}
                />
              )}  

              <h5>term flashcard</h5>

              {
                flashcard.terms.map((term, index) => (
                    <div className="card-body" key={index}>
                                  <h5 className="card-title">{term.termTitle}</h5>
                                  <p className="card-text">{term.definition}</p>


                                  {term.image && (
                <img
                  src={term.image}
                  alt="Flashcard"
                  className="img-fluid mb-2"
                  style={{ maxHeight: "150px" }}
                />
              )}  
                    </div>
                ))}
              <button
                className="btn btn-danger"
                onClick={() => dispatch(deleteFlashcard(index))}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

  
      

        
      </div>
    </div>
  );
};

export default CreateFlashCard;
