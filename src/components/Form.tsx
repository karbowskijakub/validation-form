import { useState } from "react";
import Checkbox from "./Checkbox";
import { AiFillCloseSquare } from "react-icons/ai";

interface FormData {
  name?: string;
  phone?: string;
  email?: string;
  error_test?: string;
  agreement_mail?: boolean;
  agreement_phone?: boolean;
  agreement_sms?: boolean;
}

const Form = () => {
  const [serverContent, setServerContent] = useState("");
  const [data, setData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    error_test: "",
    agreement_mail: false,
    agreement_phone: false,
    agreement_sms: false,
  });

  const [agreements, setAgreements] = useState({
    agreement_mail: false,
    agreement_phone: false,
    agreement_sms: false,
  });

  const [nameErrors, setNameErrors] = useState("");
  const [phoneErrors, setPhoneErrors] = useState("");

  const [errors, setErrors] = useState<{ agreement: string; email: string }>({
    agreement: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (!isCheckboxesVisible) {
      if (name === "email") {
        if (!validateEmail(inputValue.toString())) {
          setErrors({ ...errors, email: "Podaj poprawny adres email." });
        } else {
          setErrors({ ...errors, email: "" });
        }
      } else if (name === "name") {
        if (inputValue === "") {
          setNameErrors("Pole Imię i Nazwisko jest wymagane.");
        } else {
          setNameErrors("");
        }
      } else if (name === "phone") {
        if (
          inputValue !== "" &&
          (inputValue.toString().length !== 9 || isNaN(Number(inputValue)))
        ) {
          setPhoneErrors("Numer telefonu musi zawierać 9 cyfr.");
        } else {
          setPhoneErrors("");
        }
      }
    }

    if (type === "checkbox") {
      setAgreements({
        ...agreements,
        [name]: inputValue,
      });

      setData({
        ...data,
        [name]: inputValue,
      });
    } else {
      setData({
        ...data,
        [name]: inputValue,
      });
    }
  };

  const validateEmail = (email: string | undefined) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCheckboxesVisible) {
      if (data.name === "") {
        setNameErrors("Pole Imię i Nazwisko jest wymagane.");
      } else {
        setNameErrors("");
      }

      if (!validateEmail(data.email)) {
        setErrors({ ...errors, email: "Podaj poprawny adres email." });
      } else {
        setErrors({ ...errors, email: "" });
      }
    } else {
      const newErrors = { ...errors };

      if (
        !agreements.agreement_mail &&
        !agreements.agreement_phone &&
        !agreements.agreement_sms
      ) {
        newErrors.agreement = "Przynajmniej jedna zgoda musi być zaznaczona.";
      }

      setErrors(newErrors);

      if (Object.keys(errors).length <= 2) {
        submitForm();
      }
    }
  };

  const submitForm = () => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.email) formData.append("error_test", data.email);
    data.agreement_mail &&
      formData.append("agreement_mail", data.agreement_mail.toString());
    data.agreement_phone &&
      formData.append("agreement_phone", data.agreement_phone.toString());
    data.agreement_sms &&
      formData.append("agreement_sms", data.agreement_sms.toString());

    fetch(
      "https://test8.it4u.company/sapi/modules/contact/form/40042ce28394dc369948c018b22c534d",
      {
        body: formData,
        method: "post",
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Request failed, status: " + response.status);
        }
      })
      .then((data) => {
        console.log(data.content);
        setServerContent(data.content);
      })
      .catch((error) => {
        console.error("Fetching error: " + error);
      });
    setData({
      name: "",
      phone: "",
      email: "",
      error_test: "",
    });
    setAgreements({
      agreement_mail: false,
      agreement_phone: false,
      agreement_sms: false,
    });
    setErrors({
      agreement: "",
      email: "",
    });
    setPhoneErrors("");
  };

  const [isFlashContainerVisible, setFlashContainerVisible] = useState(false);
  const handleCloseFlashContainer = () => {
    setFlashContainerVisible(false);
    setServerContent("");
  };

  const isCheckboxesVisible =
    data.email && data.name && !errors.email && !nameErrors;

  const newWidth = "200";
  const newHeight = "150";

  const modifiedServerContent = serverContent
    .replace(/width="[^"]*"/, `width="${newWidth}"`)
    .replace(/height="[^"]*"/, `height="${newHeight}"`);

  return (
    <div className="z-10">
      <div className="title-container">
        <p>
          Czy już widzisz tutaj swój nowy dom? Skontaktuj sie z nami
          <br />
          <span style={{ fontWeight: "bold" }}>
            {" "}
            i porozmawiajmy o ofercie na działki!
          </span>
        </p>
      </div>
      <div className="container">
        <form className="form-style">
          <div style={{ marginBottom: "2em" }}>
            <input
              autoComplete="off"
              className="input-style"
              type="text"
              id="name"
              name="name"
              placeholder="IMIĘ I NAZWISKO"
              value={data.name}
              onChange={handleChange}
              required
            />
            {nameErrors && <p className="error">{nameErrors}</p>}
          </div>
          <div style={{ marginBottom: "2em" }}>
            <input
              autoComplete="off"
              className="input-style"
              type="tel"
              id="phone"
              name="phone"
              placeholder="TELEFON"
              value={data.phone}
              onChange={handleChange}
            />
            {phoneErrors && <p className="error">{phoneErrors}</p>}
          </div>
          {serverContent && (
            <div
              className={`flash-container ${
                isFlashContainerVisible ? "visible" : ""
              }`}
            >
              <AiFillCloseSquare
                className="icon"
                onClick={handleCloseFlashContainer}
              />
              <div
                dangerouslySetInnerHTML={{ __html: modifiedServerContent }}
              ></div>
            </div>
          )}
          <div style={{ marginBottom: "2em" }}>
            <input
              autoComplete="off"
              className="input-style"
              type="email"
              id="email"
              name="email"
              placeholder="EMAIL"
              value={data.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {isCheckboxesVisible && (
            <div>
              <p className="raw-text">
                Wyrażam zgodę na otrzymywanie od Duda Development Sp. z o. o.
                SKA z siedzibą w Poznaniu ul. Macieja Palacza 144, 60-278
                Poznań, informacji handlowej:
              </p>
            </div>
          )}

          {isCheckboxesVisible && (
            <div className="checkbox-wrapper">
              <Checkbox
                name="agreement_mail"
                checked={agreements.agreement_mail}
                handleChange={handleChange}
                label="w formie elektronicznej (mail) na wskazany adres mailowy"
              />

              <Checkbox
                name="agreement_phone"
                checked={agreements.agreement_phone}
                handleChange={handleChange}
                label="drogą telefoniczną, na udostępniony numer telefonu"
              />
              <Checkbox
                name="agreement_sms"
                checked={agreements.agreement_sms}
                handleChange={handleChange}
                label="w formie SMS, na udostępniony numer telefonu"
              />
            </div>
          )}
          {errors.agreement && <p>{errors.agreement}</p>}
          <div className="flex-container">
            <button className="button" type="button" onClick={handleSubmit}>
              Wyślij
            </button>
          </div>
          <div>
            <a
              className="raw-text flex-container"
              style={{ textDecoration: "underline", fontWeight: "bold" }}
            >
              Kto będzie administratorem Twoich danych osobowych?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
