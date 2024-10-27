import * as Yup from "yup";

const capitalizeTrimmed = (value) =>
  value
    ? value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase()
    : value;

const lowercaseTransform = (value) =>
  value ? value.trim().toLowerCase() : value;

const removeSpaces = (value) => (value ? value.replace(/\s+/g, "") : value);

export const validationSchema = Yup.object().shape({
  isEditing: Yup.boolean().default(true),
  firstName: Yup.string()
    .transform(capitalizeTrimmed)
    .required("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre debe tener un máximo de 50 caracteres")
    .matches(/^[a-zA-Z]+$/, "El nombre solo debe contener letras sin espacios"),

  lastName: Yup.string()
    .transform(capitalizeTrimmed)
    .required("El apellido es obligatorio")
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(50, "El apellido debe tener un máximo de 50 caracteres")
    .matches(/^[a-zA-Z]+$/, "El apellido solo debe contener letras sin espacios"),

  email: Yup.string()
    .transform(lowercaseTransform)
    .required("El correo es obligatorio")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Formato de correo no válido. Ejemplo: ejemplo@correo.com"
    ),

  phoneNumber: Yup.string()
    .transform(removeSpaces)
    .required("El teléfono es obligatorio")
    .matches(
      /^(010|012|015)\d{8}$/,
      "El número debe comenzar con 010, 012 o 015 seguido de 8 dígitos."
    ),

  role: Yup.string()
    .transform(lowercaseTransform)
    .required("El rol es obligatorio")
    .oneOf(["admin", "user"], "El rol debe ser 'admin' o 'user'"),

  password: Yup.string().when("isEditing", {
    is: true,
    then: () => Yup.string().notRequired(),
    otherwise: () =>
      Yup.string()
        .required("La contraseña es obligatoria")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])\S{8,20}$/,
          "La contraseña debe tener entre 8 y 20 caracteres, incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial, y no contener espacios."
        ),
  }),

  confirmPassword: Yup.string().when("isEditing", {
    is: true,
    then: () => Yup.string().notRequired(),
    otherwise: () =>
      Yup.string()
        .required("La confirmación de la contraseña es obligatoria")
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
  }),
});
