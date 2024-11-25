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
    <div className="container">
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
        {({ values, errors, touched, validateForm, setFieldValue }) => (
          <Form>
            {/* Main Flashcard Form */}
            <div className="container mt-2 p-4 shadow rounded bg-light">
              <div className="mb-4">
                <div class="row">
                  <div class="col-sm-6">
                    <div className="form-group mb-3">
                      <label>Create Group</label>
                      <Field
                        name="groupTitle"
                        placeholder="Enter Group name"
                        className={`form-control ${
                          errors.groupTitle && touched.groupTitle
                            ? "is-invalid"
                            : ""
                        }`}
                        onBlur={() =>
                          validateForm().then((errors) => {
                            setIsMainFormValid(
                              Object.keys(errors).length === 0
                            );
                          })
                        }
                      />
                      {errors.groupTitle && touched.groupTitle && (
                        <div className="invalid-feedback">
                          {errors.groupTitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div class="col-sm-3">
                    {" "}
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
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-9">

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
                </div>

               
              </div>
            </div>

            <div className="container mt-3 p-4 shadow rounded bg-light">
              {/* Terms Form */}
              <div className={`mb-4 ${isMainFormValid ? "" : "blurred"}`}>
                <h4>Terms</h4>
                <FieldArray name="terms">
                  {({ push, remove, replace }) => (
                    <div>
                      {values.terms.map((term, index) => (
                        <div
                          key={index}
                          className="row g-3 mb-3 align-items-end"
                        >
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
                <button type="submit" className="btn btn-lg btn-danger w-25">
                  Create 
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateFlashCard;
