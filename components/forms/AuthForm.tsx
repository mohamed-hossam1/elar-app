"use client";

import ROUTES from "@/constants/routes";
import Link from "next/link";
import { useFormik } from "formik";
import { useState } from "react";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "@/lib/validation/authValidations";
import { GetUser, SignInSupabase, SignUpSupabase } from "@/actions/userAction";
import { useRouter } from "next/navigation";
import { useUser } from "@/stores/userStore";
import { useCart } from "@/stores/cartStore";

interface AuthFormProps {
  fromType: string;
}

interface UserData {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

export default function AuthForm({ fromType }: AuthFormProps) {
  const [apiError, setApiError] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useUser();
  const {initCart} = useCart()
  const router = useRouter()
  const schema =
    fromType == "Sign Up" ? signUpValidationSchema : signInValidationSchema;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: UserData) => {
    setApiError("");
    setIsPending(true);
    
    try {
      let errorMessage = "";
      
      if (fromType === "Sign Up") {
        const result = await SignUpSupabase(values);
        if (!result.success) errorMessage = result.message;
      } else {
        const result = await SignInSupabase(values);
        if (!result.success) errorMessage = result.message;
      }
      
      if (errorMessage) {
        setApiError(errorMessage);
        setIsPending(false);
        return;
      }
      
      const userRes = await GetUser();
      if (userRes.success && userRes.data) {
        updateUser(userRes.data);
        try {
          await initCart();
        } catch (cartError) {
          console.error("Cart initialization error:", cartError);
        }
        router.replace(ROUTES.HOME);
      } else {
        setApiError(userRes.success === false ? userRes.message : "Failed to get user profile");
        setIsPending(false);
      }
      
    } catch (error) {
      console.error("Auth error:", error);
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsPending(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
    validationSchema: schema,
    onSubmit,
  });
  


  return (
    <div className="w-full max-w-sm mx-auto">
      <form className="space-y-4 w-full" onSubmit={formik.handleSubmit}>
        {apiError && (
          <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-3 text-center text-sm font-medium">
            {apiError}
          </div>
        )}
    
        {fromType === "Sign Up" && (
          <div className="relative">
            <input
              id="name"
              className={`w-full px-6 py-4 bg-gray-100/50 border-none font-satoshi  focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-black/30 ${
                formik.touched.name && formik.errors.name ? "ring-2 ring-red-500/20 bg-red-50/50" : ""
              }`}
              placeholder="Full Name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-6">
                {formik.errors.name}
              </div>
            )}
          </div>
        )}

        <div className="relative">
          <input
            id="email"
            className={`w-full px-6 py-4 bg-gray-100/50 border-none font-satoshi  focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-black/30 ${
              formik.touched.email && formik.errors.email ? "ring-2 ring-red-500/20 bg-red-50/50" : ""
            }`}
            placeholder="Email Address"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-6">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="relative">
          <input
            id="password"
            className={`w-full px-6 py-4 bg-gray-100/50 border-none font-satoshi  focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-black/30 ${
              formik.touched.password && formik.errors.password ? "ring-2 ring-red-500/20 bg-red-50/50" : ""
            }`}
            placeholder={fromType === "Sign Up" ? "Create Password" : "Password"}
            type={showPassword ? "text" : "password"}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-6">
              {formik.errors.password}
            </div>
          )}
        </div>

        {fromType === "Sign Up" && (
          <div className="relative">
            <input
              id="phone"
              className={`w-full px-6 py-4 bg-gray-100/50 border-none font-satoshi  focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-black/30 ${
                formik.touched.phone && formik.errors.phone ? "ring-2 ring-red-500/20 bg-red-50/50" : ""
              }`}
              placeholder="Phone Number"
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 px-6">
                {formik.errors.phone}
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full bg-black text-white py-4 px-4  font-satoshi font-bold text-base hover:bg-black/90 active:scale-[0.98] transition-all flex justify-center items-center ${
              isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isPending ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              `${fromType === "Sign Up" ? "Sign Up" : "Sign In"}`
            )}
          </button>
        </div>

      </form>

      <div className="mt-4 text-center">
        <p className="text-xs font-medium text-black/40">
          {fromType === "Sign Up" ? "Already have an account? " : "Don't have an account? "}
          <Link
            className="text-black font-bold hover:underline underline-offset-4"
            href={fromType === "Sign Up" ? ROUTES.SIGNIN : ROUTES.SIGNUP}
          >
            {fromType === "Sign Up" ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
