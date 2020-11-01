pragma solidity ^0.6.10;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.0.0/contracts/token/ERC20/IERC20.sol";


contract TBTCEscriow {
    struct Swap {
        IERC20  token1;
        address owner1;
        uint256 amount1;
        IERC20  token2;
        address owner2;
        uint256 amount2;
        bool isValue;
    }
    mapping (address => Swap) public Swaps;
    
    
    function createEscriow(IERC20 _token1, uint256 _amount1, IERC20 _token2, address _owner2, uint256 _amount2 ) public {
     
        Swaps[msg.sender].token1 = _token1;
        Swaps[msg.sender].owner1 = msg.sender;
        Swaps[msg.sender].amount1 = _amount1;
        Swaps[msg.sender].token2 = _token2;
        Swaps[msg.sender].owner2 = _owner2;
        Swaps[msg.sender].amount2 = _amount2;
        Swaps[msg.sender].isValue = true;
    
    }
   
    
    function getEscriow()  public view returns (IERC20 ,address,uint256,IERC20 ,address,uint256) {
        require(Swaps[msg.sender].isValue, "Escriow not authorized");
        return (Swaps[msg.sender].token1,Swaps[msg.sender].owner1,Swaps[msg.sender].amount1,Swaps[msg.sender].token2,Swaps[msg.sender].owner2,Swaps[msg.sender].amount2);
    }
    
    
    function getEscriowFromAdress(address _owner2 )  public view returns (IERC20 ,address,uint256,IERC20 ,address,uint256) {
        require(Swaps[_owner2].isValue, "Escriow address not authorized");
        return (Swaps[_owner2].token1,Swaps[_owner2].owner1,Swaps[_owner2].amount1,Swaps[_owner2].token2,Swaps[_owner2].owner2,Swaps[_owner2].amount2);
    }
    
    
    function delEscriow()  public {
        require(Swaps[msg.sender].isValue, "Delete not authorized");
        delete Swaps[msg.sender];
    }
    
  
    function runEscriow() public {
        require(Swaps[msg.sender].isValue, "Owner1 not authorized");
        require(Swaps[Swaps[msg.sender].owner2].isValue , "Owner2 not authorized");
        require(
            Swaps[msg.sender].owner1 == Swaps[Swaps[msg.sender].owner2].owner2 ||
            Swaps[msg.sender].token1 == Swaps[Swaps[msg.sender].owner2].token2 ||
            Swaps[msg.sender].amount1 == Swaps[Swaps[msg.sender].owner2].amount2,
            "Data not valid");
        
        require(
            Swaps[msg.sender].token1.allowance(Swaps[msg.sender].owner1, address(this)) >= Swaps[msg.sender].amount1,
            "Token owner1 allowance too low");
            
        require(
            Swaps[msg.sender].token2.allowance(Swaps[msg.sender].owner2, address(this)) >= Swaps[msg.sender].amount2,
            "Token owner2 allowance too low");
        

        _escriowTransferFrom(Swaps[msg.sender].token1, Swaps[msg.sender].owner1, Swaps[msg.sender].owner2, Swaps[msg.sender].amount1);
        _escriowTransferFrom(Swaps[msg.sender].token2, Swaps[msg.sender].owner2, Swaps[msg.sender].owner1, Swaps[msg.sender].amount2);
        delete Swaps[msg.sender];
        delete Swaps[Swaps[msg.sender].owner2];
        
    }


    function _escriowTransferFrom(
        IERC20 token,
        address sender,
        address recipient,
        uint amount
    ) private {
        bool sent = token.transferFrom(sender, recipient, amount);
        require(sent, "Token transfer failed");
    }
}