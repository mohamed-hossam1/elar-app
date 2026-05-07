"use client";

import { useCart } from "@/stores/cartStore";
import { useState, useEffect } from "react";
import CheckoutSkeleton from "../skeleton/CheckoutSkeleton";
import OrderSummary from "../cart/OrderSummary";
import AddressStep from "./Address/AddressStep";
import { getAddresses } from "@/actions/addressAction";
import { getDeliveryFee } from "@/actions/deliveryAction";
import { useQuery } from "@tanstack/react-query";

import PaymentStep from "./Payment/PaymentStep";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/ordersAction";
import ROUTES from "@/constants/routes";
import { useUser } from "@/stores/userStore";
import GuestAddressStep from "./Address/Guestaddressstep";
import { Address } from "@/types/Address";
import { getOrCreateGuestId, setGuestId } from "@/lib/guest";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, ShoppingBag, Loader2 } from "lucide-react";
import Image from "@/components/imageKit/ImageOptimization";

export default function CheckoutList() {
  const {
    cart,
    price,
    isLoading: cartLoading,
    clearCart,
    appliedPromo,
    setAppliedPromo,
  } = useCart();

  const { user } = useUser();
  const { 
    data: addresses = [], 
    isLoading: isLoadingAddresses,
    refetch: refetchAddresses
  } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await getAddresses();
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    enabled: !!user
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [guestAddress, setGuestAddress] = useState({
    name: "",
    phone: "",
    city: "",
    area: "",
    address_line: "",
  });

  const [selectedPayment, onSelectPayment] = useState<string | null>(null);
  const [vodafoneImageUrl, setVodafoneImageUrl] = useState<string | null>(null);
  const [instapayImageUrl, setInstapayImageUrl] = useState<string | null>(null);

  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [stepNumber, setStepNumber] = useState(1);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isCartSummaryOpen, setIsCartSummaryOpen] = useState(false);

  const router = useRouter();

  const handleAddressSelected = async (address: Address | null) => {
    setSelectedAddress(address);
    setIsLoadingFee(true);
    if (address) {
      try {
        const fee = await getDeliveryFee(address.city);
        if (fee && fee.success) {
          setDeliveryFee(fee.data);
        } else {
          setDeliveryFee(0);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
        setDeliveryFee(0);
      }
    } else {
      setDeliveryFee(0);
    }
    setIsLoadingFee(false);
  };

  const handleGuestAddressChange = async (addressData: typeof guestAddress) => {
    const cityChanged = addressData.city !== guestAddress.city;
    setGuestAddress(addressData);

    if (cityChanged) {
      if (addressData.city) {
        setIsLoadingFee(true);
        try {
          const fee = await getDeliveryFee(addressData.city);
          if (fee && fee.success) {
            setDeliveryFee(fee.data);
          } else {
            setDeliveryFee(0);
          }
        } catch (error) {
          console.error("Error fetching delivery fee:", error);
          setDeliveryFee(0);
        }
        setIsLoadingFee(false);
      } else {
        setDeliveryFee(0);
      }
    }
  };

  if (cartLoading || isLoadingAddresses || cart === null) {
    return <CheckoutSkeleton />;
  }

  const isNextDisabled = (() => {
    if (user) {
      return selectedAddress === null || !selectedPayment;
    } else {
      return (
        !guestAddress.name ||
        !guestAddress.phone ||
        !guestAddress.city ||
        !guestAddress.area ||
        !guestAddress.address_line ||
        !selectedPayment
      );
    }
  })();

  const handlePlaceOrder = async () => {
    if (!selectedPayment || !cart) {
      toast.error("Please complete all steps");
      return;
    }

    if (user && !selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    if (!user) {
      if (
        !guestAddress.name ||
        !guestAddress.phone ||
        !guestAddress.city ||
        !guestAddress.area ||
        !guestAddress.address_line
      ) {
        toast.error("Please fill in all address fields");
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      const isConditionMet = appliedPromo
        ? price >= appliedPromo.min_purchase
        : true;
      const discountAmount =
        appliedPromo && isConditionMet
          ? appliedPromo.type === "percentage"
            ? (price * (appliedPromo.value || 0)) / 100
            : Math.min(price, appliedPromo.value || 0)
          : 0;

      const subtotalAfterDiscount = Math.max(0, price - discountAmount);
      const total = subtotalAfterDiscount + deliveryFee;

      let paymentImage: string | undefined = undefined;
      const p = selectedPayment.toLowerCase();
      if (p === "vodafone cash" && vodafoneImageUrl) {
        paymentImage = vodafoneImageUrl;
      } else if (p === "instapay" && instapayImageUrl) {
        paymentImage = instapayImageUrl;
      }

      const guestId = !user ? getOrCreateGuestId() : undefined;
      const result = await createOrder(
        {
          subtotal: price,
          discount_amount: discountAmount,
          total_price: total,
          delivery_fee: deliveryFee,
          payment_method: selectedPayment as string,
          payment_image: paymentImage, 
          coupon_id: appliedPromo?.id,
          user_id: user?.id,
          guest_id: guestId,
          city: user ? selectedAddress?.city! : guestAddress.city,
          area: user ? selectedAddress?.area! : guestAddress.area,
          address_line: user
            ? selectedAddress?.address_line!
            : guestAddress.address_line,
          user_name: user ? user.name || "" : guestAddress.name,
          phone: user ? selectedAddress?.phone || "" : guestAddress.phone,
        },
        Object.values(cart),
      );

      if (result.success) {
        if (!user && guestId) {
          setGuestId(guestId);
        }
        await clearCart();
        setAppliedPromo(null);

        router.push(
          `${ROUTES.ORDER_SUCCESS}?orderId=${result.data.id}&isGuest=${!user}`,
        );
      } else {
        toast.error(`Failed to place order: ${result.message}`);
      }
    } catch (error) {
      console.error("Place order error:", error);
      toast.error("An error occurred while placing your order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1400px] px-4 sm:px-6 lg:px-8 m-auto mt-6 md:mt-12 mb-20 min-h-screen">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-integral font-black tracking-widest uppercase text-black">
          Checkout
        </h1>
        {!user && (
          <p className="text-[10px] md:text-xs text-black/60 mt-4 uppercase font-bold tracking-[0.2em] leading-relaxed">
            Buying as guest? 
            <a
              href={ROUTES.SIGNIN}
              className="text-black hover:opacity-60 transition-opacity ml-1.5 underline underline-offset-4"
            >
              Sign in
            </a>{" "}
            to sync your order history.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="w-full lg:flex-[1.5] space-y-10">
          <section className="bg-white border border-black/10 overflow-hidden">
            <button 
              onClick={() => setIsCartSummaryOpen(!isCartSummaryOpen)}
              className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-black/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Your Items ({Object.keys(cart || {}).length})</span>
              </div>
              {isCartSummaryOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            
            {isCartSummaryOpen && (
              <div className="border-t border-black/10 p-4 sm:p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {Object.entries(cart || {}).map(([key, item]) => (
                  <div key={key} className="flex gap-4 items-center">
                    <div className="size-16 relative border border-black/10 shrink-0">
                      <Image 
                        src={item.variant.product?.image_cover || ""} 
                        alt={item.variant.product?.title || ""} 
                        fill 
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase truncate">{item.variant.product?.title}</p>
                      <p className="text-[10px] text-black/60 font-medium uppercase tracking-widest mt-0.5">
                        {item.variant.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-bold shrink-0">EGP {item.variant.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black uppercase font-integral tracking-tight mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-none border border-black bg-black text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              Delivery Details
            </h2>
            <div className="border border-black rounded-none bg-white p-6 sm:p-8">
              {user ? (
                <AddressStep
                  addresses={addresses}
                  onAddressSelected={handleAddressSelected}
                  onRefresh={refetchAddresses}
                  selectedAddress={selectedAddress || null}
                />

              ) : (
                <GuestAddressStep
                  guestAddress={guestAddress}
                  onAddressChange={handleGuestAddressChange}
                />
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-black uppercase font-integral tracking-tight mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-none border border-black bg-black text-white flex items-center justify-center text-sm font-bold">
                2
              </span>
              Payment Method
            </h2>
            <div className="border border-black rounded-none bg-white p-6 sm:p-8">
              <PaymentStep
                onSelectPayment={onSelectPayment}
                selectedPayment={selectedPayment}
                onVodafoneImageChange={setVodafoneImageUrl}
                onInstapayImageChange={setInstapayImageUrl}
                vodafoneNumber="01013429234"
                instapayLink="https://instapay.com"
              />
            </div>
          </section>
        </div>

        <div className="w-full lg:flex-1">
          <div className="sticky top-28 space-y-6">
            <OrderSummary
              price={price}
              isCart={false}
              deliveryFee={deliveryFee}
              hasAddress={user ? !!selectedAddress : !!guestAddress.city}
              isLoadingFee={isLoadingFee}
            />

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-black sm:relative sm:p-0 sm:bg-transparent sm:border-none z-50">
              <button
                disabled={isPlacingOrder || isNextDisabled}
                className="w-full py-4 z-50 bg-black text-white font-bold border border-black hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                onClick={handlePlaceOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
