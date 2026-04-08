import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react';
import { address, createSolanaRpc } from '@solana/kit';
import { transferSol, transferToken } from '../../utils/solanaUtils';
const USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
const EURC_MINT = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr' // Replace with real if needed
const SOLANA_RPC = 'https://api.devnet.solana.com'

const Dashboard = () => {
  const selectedAccount = useSelector(state => state.accounts.selected)
  const [solBalance, setSolBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [eurcBalance, setEurcBalance] = useState(0)

  useEffect(() => {
    // if (!selectedAccount) return
    console.log(selectedAccount)
    const rpc = createSolanaRpc(SOLANA_RPC);
    const fetchBalances = async () => {
      // SOL balance
      try {
        const solRes = await rpc.getAccountInfo(address(selectedAccount.publicKeyBase58)).send()
        // console.log(solRes)
        setSolBalance(((solRes.value?.lamports || BigInt(0)) / BigInt(1e9)));
      } catch (e) {
        console.log(e)
        setSolBalance(null)
      }


      // // USDC balance
      const tokenAccounts = await rpc.getTokenAccountsByOwner(selectedAccount.publicKeyBase58, {
        mint: address(USDC_MINT)
      }, {
        encoding: "jsonParsed"
      }).send()
      // console.log(tokenAccounts);
      if (tokenAccounts.value.length) {
        const usdtBalance = await rpc
          .getTokenAccountBalance(tokenAccounts.value[0].pubkey)
          .send();

        const amount = usdtBalance.value.amount;
        const decimals = usdtBalance.value.decimals;

        const formattedBalance = Number(amount) / Math.pow(10, decimals);

        console.log(formattedBalance);

        setUsdcBalance(formattedBalance);
      }




      // // EURC balance
      const eurcTokenAccounts = await rpc.getTokenAccountsByOwner(selectedAccount.publicKeyBase58, {
        mint: address(EURC_MINT)
      }, {
        encoding: "jsonParsed"
      }).send()
      console.log(eurcTokenAccounts);
      if (eurcTokenAccounts.value.length) {
        const eurcBalance = await rpc
          .getTokenAccountBalance(eurcTokenAccounts.value[0].pubkey)
          .send();

        const amount = eurcBalance.value.amount;
        const decimals = eurcBalance.value.decimals;

        const formattedBalance = Number(amount) / Math.pow(10, decimals);

        console.log(formattedBalance);

        setEurcBalance(formattedBalance);
      }
    }

    selectedAccount && fetchBalances() // initial load
    const interval = setInterval(fetchBalances, 10000) // every 10 sec
    //  selectedAccount && transferToken("d8ZLgFUjrugT4ce645Gc8JmxPX4M7UC1BadZHXsApX1","1000000","4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",selectedAccount)
    return () => clearInterval(interval) // cleanup



  }, [selectedAccount])

 useEffect(() => {

        // generateNewWallet().then(({ privateKeyBase58, publicKeyBase58 }) => {
        //     console.log(privateKeyBase58);
        //     console.log(publicKeyBase58);
        //     addAccounts({
        //         encryptedKey: privateKeyBase58,
        //         publicKeyBase58: publicKeyBase58,
        //         iv: "0+LUE9I255VNL54k",
        //         name: "wallet 1",
        //         id: "1"
        //     }).then(console.log)

        // });


       




    }, [])



  const renderCard = (label, balance) => (
    <CCol xs={12} md={4} key={label}>
      <CCard>
        <CCardHeader>{label}</CCardHeader>
        <CCardBody>{balance === null ? <CSpinner size="sm" /> : <h4>{balance}</h4>}</CCardBody>
      </CCard>
    </CCol>
  )

  return (
    <CRow>
      {renderCard('SOL Balance', solBalance)}
      {renderCard('USDC Balance', usdcBalance)}
      {renderCard('EURC Balance', eurcBalance)}
    </CRow>
  )
}

export default Dashboard
