import { requireAccountUser } from "@/lib/auth-guards";
import { getMyReviews } from "@/lib/account-db";
import ReviewsView from "@/components/account/ReviewsView";

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const { accountUser } = await requireAccountUser("/account/reviews");
  const reviews = await getMyReviews();
  return <ReviewsView user={accountUser} reviews={reviews} />;
}
