import z from 'zod';

const autoresSchema = z.object({
    name: z.string().min(3, 'el nombre debe tener 3 caraacteres al menos'),
    birthdate : z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})


export const validarAutor = (data) => {
    const result = autoresSchema.safeParse(data);
  
    if (!result.success) {
      return { valid: false, errors: result.error.format() };
    }
    return { valid: true, data: result.data };
  };

