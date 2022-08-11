import supabase from "./services/supabase"
import { v4 } from "uuid"

const nonceApi = async (req, res) => {
  const { ethAddress } = req.body
  const nonce = v4()

  let { data, error } = await supabase.from('users').select('nonce').eq('user_address', ethAddress)

  if (data.length > 0) {
    let {data, error} = await supabase.from('users').update({ nonce }).match({ user_address: ethAddress })
  } else {
    let {data, error} = await supabase.from('users').insert({ nonce, user_address: ethAddress })
  }

  if (error) {
    res.status(400).json({ error: error.message })
  } else {
    res.status(200).json({ nonce })
  }
}

export default nonceApi