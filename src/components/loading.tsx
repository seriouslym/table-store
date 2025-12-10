import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return <>
    <LoaderCircle className="animate-spin"></LoaderCircle>
    <span>Loading...</span>
  </>
}