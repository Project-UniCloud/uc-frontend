export default loginSchema = z.object({
  login: z.string().min(5, { message: "Niepoprawny indeks!" }),
  password: z.string().min(1, { message: "Hasło jest wymagane!" }),
});
