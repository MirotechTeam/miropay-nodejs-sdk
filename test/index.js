require("dotenv").config();
const PaymentRestClient = require("miropay-payment-sdk-test").default;
const { GATEWAY } = require("miropay-payment-sdk-test");

const privateKey = process.env.PV_KEY;
const secret = process.env.SECRET;

const prc = new PaymentRestClient(privateKey, secret);

async function main() {
  try {
    const createdPayment = await createPayment();
    console.log(createdPayment);
    const paymentInfo = await getPayment(createdPayment.data.referenceCode);
    console.log(paymentInfo);
  } catch (err) {
    console.error(err);
  }
}

const getPayment = async (referenceCode) => {
  const { body } = await prc.getPaymentById(referenceCode);
  return body;
};

const createPayment = async () => {
  const { body } = await prc.createPayment({
    amount: "1000",
    gateways: [GATEWAY.NASS_WALLET],
    title: "Test",
    description: "Desc",
    redirectUrl: "https://google.com",
    collectFeeFromCustomer: false,
    collectCustomerEmail: false,
    collectCustomerPhoneNumber: false,
  });
  return body;
};

const cancelPayment = async () => {
  const { body } = await prc.cancelPayment(testReferenceCode);
  return body;
};

const verifyPayment = async () => {
  const res = await prc.verify(verifyTestPayload);
  return res;
};

main();
