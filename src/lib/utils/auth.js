import { auth, firestore } from "@/lib/sdk/firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'

const createAccount = async (email="", name="", pass) => {
    try {
        let res = await createUserWithEmailAndPassword(auth, email, pass)
        await setDoc(doc(firestore, `users/${res.user.email}`), {
            email: res.user.email,
            id: res.user.uid,
            nombre: name,
        })

    } catch(error) {
        let errorCode = ""
        errorCode = error.code
        console.log("auth error ocurred while creating account", errorCode)
    }
}

const updateAccountOnDB = async (userEmail="", customerId="") => {
    try {
        await updateDoc(doc(firestore, `users/${userEmail}`), {
            stripeCustomerId: customerId
        })

    } catch(error) {
        console.log("error while updating account", error)
    }
}

const priceFmtt = (chargeInfoTemp) => {
    let realUnitAmount = chargeInfoTemp.unitAmount/100
	let initialUnitAmount = (chargeInfoTemp.unitAmount/100)*0.84
	let tax = initialUnitAmount*0.16
	let taxFmt = tax.toPrecision(2)

	let parsedAmount = initialUnitAmount.toString()
	let finalAmount = realUnitAmount.toString()
    
    const priceFmt = {
        parsedAmount: parsedAmount,
        finalAmount: finalAmount,
        taxFmt: taxFmt,
    }

    return priceFmt
}


const complexPriceFmtt = (complexPriceTemp) => {
    let realUnitAmount = complexPriceTemp.pi_amount/100
    let initialUnitAmount = (complexPriceTemp.pi_amount/100)*0.84
    let tax = initialUnitAmount*0.16
    let taxFmt = tax.toPrecision(2)

    let parsedAmount = initialUnitAmount.toString()
    let finalAmount = realUnitAmount.toString()
    let currency = complexPriceTemp.pi_currency

    const priceFmt = {
        parsedAmount: parsedAmount,
        finalAmount: finalAmount,
        taxFmt: taxFmt,
        currency: currency,
    }

    return priceFmt
}

export { createAccount, updateAccountOnDB, priceFmtt, complexPriceFmtt }

