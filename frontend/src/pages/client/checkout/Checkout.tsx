// Import the necessary modules
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox, TextField } from "@mui/material";
import ClientLayout from "../ClientLayout";
import * as yup from "yup";
import { useState } from "react";
import { submitCheckout } from "../../../services/api/checkoutService";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Create interfaces for form data
export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  companyName?: string;
  address: string;
  country: string;
  zipcode: string;
  town: string;
  phone: string;
  email: string;
  description?: string;
}

export interface SubmitCheckoutData extends CheckoutFormData {
  paymentMethod: string;
  totalPrice: number;
}

// Define the validation schema using yup
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  companyName: yup.string(),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  zipcode: yup.number().required("Zipcode is required"),
  town: yup.string().required("Town is required"),
  phone: yup.string().required("Phone is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  description: yup.string(),
});

// Define the Checkout component
const Checkout = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(1549.0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigator = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const response = await submitCheckout({
        ...data,
        paymentMethod: selectedPaymentMethod,
        totalPrice: totalPrice,
      } as SubmitCheckoutData);
      console.log(response.data);

      // If the form is submitted successfully, show Snackbar and navigate to the home page
      setSnackbarOpen(true);
      navigator("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ClientLayout>
      <div className="w-full mb-20 flexCenter mt-14">
        <div className="max-w-[1120px] flexCenter flex-col">
          <h1 className="text-3xl font-semibold text-center md:text-6xl">
            Checkout
          </h1>
          <form
            className="flex-col flexCenter lg:flexCenter"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full">
              <h2 className="mb-4 text-2xl font-semibold text-center">
                Billing Details
              </h2>
              <div className="flex flex-col gap-4">
                {Object.keys(schema.fields).map((fieldName, index) => (
                  <div key={index} className="w-[80vw]">
                    <Controller
                      name={
                        fieldName as
                          | "address"
                          | "firstName"
                          | "lastName"
                          | "companyName"
                          | "country"
                          | "zipcode"
                          | "town"
                          | "phone"
                          | "email"
                          | "description"
                      }
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={fieldName
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          variant="outlined"
                          className="w-full"
                          error={!!errors[fieldName as keyof typeof errors]}
                          helperText={
                            errors[fieldName as keyof typeof errors]?.message
                          }
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[80vw] max-h-[157px] bg-gray/20 rounded-md p-3 mt-4">
              <h2 className="text-base font-normal">Select Payment</h2>
              <div className="flex flex-row items-center">
                <Checkbox
                  checked={selectedPaymentMethod === "Cash on Delivery"}
                  onChange={handlePaymentMethodChange}
                  inputProps={{ "aria-label": "controlled" }}
                  value="Cash on Delivery"
                />
                <span className="text-sm">Cash on Delivery</span>
              </div>
              <div className="flex flex-row items-center">
                <Checkbox
                  checked={selectedPaymentMethod === "Paypal"}
                  onChange={handlePaymentMethodChange}
                  inputProps={{ "aria-label": "controlled" }}
                  value="Paypal"
                />
                <span className="text-sm">Paypal</span>
              </div>
            </div>
            <div className="w-[80vw] max-h-[157px] bg-gray/20 rounded-md p-3 mt-4 flexBetween text-2xl">
              <h2 className="text-base text-2xl font-normal">Total:</h2>
              <span className="text-2xl text-customGreen">
                LKR {totalPrice}
              </span>
            </div>
            <button
              type="submit"
              className="w-[80vw] bg-customGreen text-4xl font-semibold h-12 rounded-md mt-4 text-white "
            >
              Place an Order
            </button>
          </form>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity="success"
          >
            Thank you! Your order has been placed.
          </MuiAlert>
        </Snackbar>
      </div>
    </ClientLayout>
  );
};

export default Checkout;
