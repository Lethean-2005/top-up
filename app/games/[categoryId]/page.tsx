import { notFound } from "next/navigation";
import Link from "next/link";
import { FazercardsError, getTopupOffers, listValidateIdCategories } from "@/lib/fazercards";
import { findValidateCategory } from "@/lib/utils";
import OrderForm from "@/components/OrderForm";

// This calls a live, key-authenticated API — never prerender it at build
// time (the build environment may not have the secret key available yet).
export const dynamic = "force-dynamic";

export default async function GamePage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  let offersData;
  try {
    offersData = await getTopupOffers(categoryId);
  } catch (err) {
    if (err instanceof FazercardsError && (err.status === 400 || err.status === 404)) {
      notFound();
    }
    throw err;
  }

  let validateFields: (typeof offersData.fields) | null = null;
  let validateCategoryId: string | null = null;
  try {
    const validateList = await listValidateIdCategories();
    const match = findValidateCategory(offersData.name, validateList.items);
    if (match) {
      validateFields = match.fields;
      validateCategoryId = match.category_id;
    }
  } catch {
    // The validation catalog is a nice-to-have; ignore failures.
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        ← Back to all games
      </Link>

      <div className="mt-4 flex items-center gap-4">
        {offersData.imageurl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offersData.imageurl}
            alt=""
            className="h-16 w-16 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{offersData.name}</h1>
          {offersData.note && <p className="mt-1 text-sm text-zinc-500">{offersData.note}</p>}
        </div>
      </div>

      <OrderForm
        categoryId={categoryId}
        offers={offersData.offers}
        fields={offersData.fields}
        validateFields={validateFields}
        validateCategoryId={validateCategoryId}
      />
    </div>
  );
}
