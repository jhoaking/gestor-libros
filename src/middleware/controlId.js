export const validarId = (req, res, next) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "El id debe ser un número entero válido" });
    }

    next(); 
};