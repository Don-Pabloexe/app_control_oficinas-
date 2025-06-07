// app/api/registro/route.ts
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { nombre, tipo, hora, metodo } = body;

  try {
    await addDoc(collection(db, "registros"), {
      nombre,
      tipo,
      hora,
      metodo
    });

    return NextResponse.json({ mensaje: "Registro exitoso" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ mensaje: "Error al guardar", error }, { status: 500 });
  }
}
