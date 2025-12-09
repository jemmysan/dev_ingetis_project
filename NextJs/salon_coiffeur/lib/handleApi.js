import { NextResponse } from "next/server";

export function handleApi(fn) {
  return async (request, ...args) => {
    try {
      // exécute ta logique API
      return await fn(request, ...args);
    } catch (err) {
      console.error("API Error:", err);

      return NextResponse.json(
        {
          error: "Erreur interne du serveur",
          details: err.message
        },
        { status: 500 }
      );
    }
  };
}
