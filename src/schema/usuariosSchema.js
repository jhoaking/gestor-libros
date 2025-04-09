import z from 'zod';

const registerSchema = z.object({
    nombre:z.string().min(4,"el nombre debe tener minimo 4 caracteres"),
    email: z.string().email(),
    password: z.string().min(6, "la contraseña debe tener minimo 6 caracteres")
})


export const validarUsuarioRegister = (data) => {
    const result = registerSchema.safeParse(data);
  
    if (!result.success) {
      return { valid: false, errors: result.error.format()};
    }
    return { valid: true, data: result.data };
  };


const loginSchema=   z.object({
    email: z.string().email(),
    password: z.string().min(6, "la contraseña debe tener minimo 6 caracteres")
})

export const validarUsuarioLogin = (data) => {
    const result = loginSchema.safeParse(data);
  
    if (!result.success) {
      return { valid: false, errors: result.error.format()};
    }
    return { valid: true, data: result.data };
  };
