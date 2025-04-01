import z from 'zod';

const autoresSchema = z.object({
    name: z.string().min(3, 'el nombre debe tener 3 caraacteres al menos'),
    birthdate : z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const validarAutor = (input) =>{
    return  autoresSchema.partial().safeParse(input);
}