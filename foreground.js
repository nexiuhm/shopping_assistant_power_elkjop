
{ // anonomous namespace 

    /* Options */
    let digitalVersion = false; // 
    let attemptFrequency = 100; // milliseconds
    let attempts = 0;
    let timeoutObject = null;
    let autoCheckoutEnabled = true;
    let hasProduct = false;

    window.deliveryInfo = { // Set this in console by using "setDeliveryInfo(jsonObject)"
      adress: "",
      city: "Bergen",
      email: "erlend.halvorsen@gmail.com",
      firstName: "Erlend",
      lastName:"Halvorsen",
      phone: "+4799999999",
      postalCode: "5005",
    }


    let isPower = (window.location.hostname === "www.power.no") ? true : false;

    createStatusPanelOverlay();
    startAttempts();

    
    function startAttempts() {

      const attempt = isPower ? addToCartPower : addToCartElkjop;
   

      window.setInterval(()=> {
          if(!hasProduct) attempt();
        }, 
      attemptFrequency);

    }



    function createStatusPanelOverlay() {

      const container = document.createElement("div");
      container.classList.add("bot-panel-container", "fade-in")
      container.innerHTML = "<h1> Hello </h1>";

      document.body.appendChild(container);

  }

    /* Elkjøp */
    async function addToCartElkjop() {

        const playStationProduktIdDigital = 220280; // elkjøp
        const playStationProduktIdDisk = 220276;

        const productIdTarget = digitalVersion ? playStationProduktIdDigital : playStationProduktIdDisk;


        const res = await fetch("https://www.elkjop.no/INTERSHOP/web/WFS/store-elkjop-Site/no_NO/-/NOK/ViewCart-AddProductByAjax?SKU="+ playStationProduktIdDisk + "&Quantity=1&AddToCart=true", {
        "headers": {
            "accept": "text/html, */*; q=0.01",
            "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
            "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.elkjop.no/product/gaming/spill/spill-playstation-4/40996/cyberpunk-2077-collector-s-edition-ps4",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
        });

        console.log("Response from add to cart Server: " + await res.text());
        updateAttempts();
        
    

        
    }

    function updateAttempts() {
        attempts += 1;
        let counter = document.querySelector(".bot-panel-container > h1");
        //counter.style.animationPlayState = "initial";
        counter.innerHTML = attempts;
    
    }

    

    async function addToCartPower() {
      const res = await fetch("https://www.power.no/api/basket/products", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
          "content-type": "application/json",
          "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://www.power.no/gaming/gamingmus/dacota-gaming-breach-traadloes-spillmus/p-983894/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"ProductId\":1077687,\"DeltaQuantity\":1}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });

      const json = await res.json();
      console.log(deliveryInfo);


      /* debug */

      console.log("Reponse code:" + res.status);
      console.log("Server response: " + JSON.stringify(json));

      /*  server returnerer kode 200 visst ting er lagt til i handlekurven og er på lager/tilgjegelig for kjøp     */

      if(res.status === 200) {

    
         console.log(" ITS HAPPENING!!!")
         // Go to cart -> kjøp med kort vipps insta
         hasProduct = true;
         autoCheckoutEnabled && powerPay();
        
      }

      else if (res.status === 400) {

         console.log(" keeeP tryIN");

         
      }
      

      updateAttempts();

    }

    async function addToCartNetonNet(){
      fetch("https://www.netonnet.no/Checkout/AddItem/", {
          "headers": {
            "accept": "*/*",
            "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
          },
          "referrer": "https://www.netonnet.no/art/gaming/spillogkonsoll/playstation/playstation-spill/ps5-call-of-duty-cold-war/1014293.15690/",
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": "itemId=1014293&isCheckout=false",
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });
    }

} // end of namespace
async function powerPay() {




await fetch("https://www.power.no/api/basket/contactinfo", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.power.no/checkout/contactinfo/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"DeliveryInformation\":{\"Address\":\""+ deliveryInfo.adress +"\",\"City\":\""+ deliveryInfo.city +"\",\"Email\":\""+ deliveryInfo.email +"\",\"FirstName\":\""+deliveryInfo.firstName+"\",\"LastName\":\""+deliveryInfo.lastName+"\",\"Phone\":\""+deliveryInfo.phone+"\",\"PostalCode\":\""+deliveryInfo.postalCode+"\",\"Company\":null,\"CompanyVATNumber\":null,\"SSN\":null},\"ReceiptInformation\":{\"Address\":\""+deliveryInfo.adress+"\",\"City\":\""+deliveryInfo.city+"\",\"Email\":\""+deliveryInfo.email+"\",\"FirstName\":\""+deliveryInfo.firstName+"\",\"LastName\":\""+deliveryInfo.lastName+"\",\"Phone\":\""+deliveryInfo.phone+"\",\"PostalCode\":\""+deliveryInfo.postalCode+"\",\"Company\":null,\"CompanyVATNumber\":null,\"SSN\":null},\"NewsletterSubscription\":false,\"Validate\":true,\"MyPowerClubSubscription\":false}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

await fetch("https://www.power.no/api/basket/freight", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.power.no/checkout/freight/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"BasketFreightId\":1,\"FreightId\":1}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

await fetch("https://www.power.no/api/basket/paymentMethod", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.power.no/checkout/payment/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "11",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

let res = await fetch("https://www.power.no/api/basket/pay", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://www.power.no/checkout/payment/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"PaymentMethodId\":11,\"PaymentDetails\":[]}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

let json = await res.json();

// go to vipps
window.location.href = json.PaymentUrl;


}

