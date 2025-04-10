import z from "zod";


const comprasSchema = z.object({
    user_id : z.string().uuid(),
    descripcion: z.string(),
    precio: z.number().positive(),
    id :  z.number().int().positive()
})

export const validarCompra =  (input) =>{
    const result =  comprasSchema.safeParse(input);
    if (!result.success) {
        return { valid: false, errors: result.error.format()};
      }
      return { valid: true, data: result.data };
}