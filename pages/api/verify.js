import supabase from "./services/supabase"
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

const verify = async (req, res) => {
  try {
    const { ethAddress, signature, nonce } = req.body;
    // Retrieving the user address that signed the message
    const signerAddr = ethers.utils.verifyMessage(nonce, signature)

    // If the signature does not match with the address owner we throw an error
    if (signerAddr !== ethAddress) {
      throw new Error ("wrong_signature")
    } 
    
    // Searching for our user instance and returning it
    let { data: user, error } = await supabase.from('users').select('*').eq('user_address', ethAddress).eq('nonce', nonce).single()

    // Generating a JWT token for the connected user
    const token = jwt.sign({
      "aud": "authenticated",
      // The token we be live 60 min
      "exp": Math.floor((Date.now() / 1000 + (60*60))),
      // NEVER PUT SOMETHING SECRET HERE
      "sub": user.id,
      "user_metadata": {
        id: user.id
      },
      "role": "authenticated"
    }, process.env.SUPABASE_JWT_SECRET)

    res.status(200).json({ user, token })
    } catch (error) {
      res.status(400).json({error: error.message})
    }
};

export default verify