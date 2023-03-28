import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(document.getElementById("wei").value);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;

// Challenge 4: Persistence 💾
// When you refresh the page, all the escrow smart contracts are gone! 😱

// It would be nice if we could keep track of all smart contracts that have been deployed. We could do this by creating a server that keeps track of all the deployed Escrow Smart Contracts. Either that or a page that can interface with any Escrow contract given a particular address.

// Challenge 5: What else? 🤔
// What else can be done with the Decentralized Escrow Application?

// Is there something that can be added to the Escrow Contract? If so, feel free to change the Escrow.sol in /contracts and make sure to test it afterwards by running npm run test!

// 📖 Further Research
// The arbiter is a stand-in for perhaps a more complex mechanism that can arbitrate a transaction. What do we mean by this? 🤔

// Well, what if, instead of having an arbiter, you could prove that goods were sent to a recipient? Then you wouldn't need the arbiter to approve the address. If it is a digital transaction you could tie into that transaction directly.

// Another thing to consider: what if the arbiter wasn't a single person, but an organization which could sign off on a transaction? This may make more sense for larger transactions.

// To conclude, we've helped you set up a very minimal skeleton dApp - fully functional, but still needs so so many features! Go ahead and be creative, build the best escrow dApp the world has ever seen! 🚀
