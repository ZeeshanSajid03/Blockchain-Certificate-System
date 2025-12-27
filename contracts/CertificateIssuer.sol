// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateIssuer {

    address public admin;

    struct Certificate {
        string certHash;
        address issuer;
        uint256 timestamp;
    }

    mapping(string => Certificate) private certificates;
    mapping(address => bool) public authorizedIssuers;

    constructor() {
        admin = msg.sender; // deployer becomes admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Not authorized issuer");
        _;
    }

    function addIssuer(address _issuer) public onlyAdmin {
        authorizedIssuers[_issuer] = true;
    }

    function issueCertificate(
        string memory _certId,
        string memory _certHash
    ) public onlyAuthorizedIssuer {
        require(bytes(certificates[_certId].certHash).length == 0,
                "Certificate already exists");

        certificates[_certId] = Certificate(
            _certHash,
            msg.sender,
            block.timestamp
        );
    }

    function verifyCertificate(string memory _certId)
        public
        view
        returns (string memory, address, uint256)
    {
        Certificate memory cert = certificates[_certId];
        return (cert.certHash, cert.issuer, cert.timestamp);
    }
}
