import Form from "../components/Form";

const FormPage = () => {
  return (
    <>
      <div className="w-100 vh-100  position-relative">
        <div className="position-absolute w-100 top-0 left-0">
          <div className="bg-image">
            <div className="bg-shadow"></div>
          </div>
        </div>

        <div className="w-100 vh-100  position-relative d-flex justify-content-center align-items-center">
          <Form />
        </div>
      </div>
    </>
  );
};

export default FormPage;
