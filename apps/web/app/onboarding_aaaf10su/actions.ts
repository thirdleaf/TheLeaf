"use server";

export async function submitOfferLetter(formData: FormData) {
  const referenceId = formData.get("referenceId") as string;
  const file = formData.get("offerLetter") as File;

  if (!referenceId || !file) {
    throw new Error("Missing required fields");
  }

  // Simulate a 3.5 second secure upload process
  await new Promise((resolve) => setTimeout(resolve, 3500));

  return { success: true };
}
