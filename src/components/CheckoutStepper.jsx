import { createElement } from "react";
import { Check, CircleCheck, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import "./CheckoutStepper.css";

const STEPS = [
  { label: "Cart", icon: ShoppingCart },
  { label: "Delivery", icon: MapPin },
  { label: "Payment", icon: CreditCard },
  { label: "Complete", icon: CircleCheck },
];

function CheckoutStepper({ currentStep }) {
  const activeStep = Math.min(Math.max(Number(currentStep) || 1, 1), STEPS.length);

  return <section className="checkout-stepper" aria-label="Checkout progress">
    {STEPS.map(({ label, icon: Icon }, index) => {
      const step = index + 1;
      const state = step < activeStep ? "completed" : step === activeStep ? "current" : "upcoming";
      return <div className="checkout-stepper-item" key={label}>
        <div className={`checkout-stepper-step ${state}`}><span className="checkout-stepper-circle">{state === "completed" ? <Check size={19} /> : createElement(Icon, { size: 19 })}</span><span>{label}</span></div>
        {step < STEPS.length && <span className={`checkout-stepper-line ${step < activeStep ? "completed" : ""}`} />}
      </div>;
    })}
  </section>;
}

export default CheckoutStepper;
