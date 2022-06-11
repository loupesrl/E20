// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;
import "hardhat/console.sol";

interface ERC721 {
    function balanceOf(address _address) external returns (uint256);
}

interface IXPoap {
    function tokenDetailsOfOwnerByIndex(address, uint256)
        external
        returns (uint256, uint256);
}

contract PollManager {
    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Vote {
        uint256 poll;
        uint8 answer;
    }

    bytes32 constant EIP712DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    bytes32 constant VOTE_TYPEHASH =
        keccak256("Vote(uint256 poll,uint8 answer)");

    bytes32 DOMAIN_SEPARATOR;

    constructor() {
        DOMAIN_SEPARATOR = hash(
            EIP712Domain({
                name: "Vote",
                version: "1",
                chainId: 1,
                verifyingContract: address(this)
            })
        );
    }

    function hash(EIP712Domain memory eip712Domain)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    EIP712DOMAIN_TYPEHASH,
                    keccak256(bytes(eip712Domain.name)),
                    keccak256(bytes(eip712Domain.version)),
                    eip712Domain.chainId,
                    eip712Domain.verifyingContract
                )
            );
    }

    function hash(Vote memory vote) internal pure returns (bytes32) {
        return keccak256(abi.encode(VOTE_TYPEHASH, vote.poll, vote.answer));
    }

    function getAddress(
        Vote memory vote,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal view returns (address) {
        // Note: we need to use `encodePacked` here instead of `encode`.
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hash(vote))
        );
        return ecrecover(digest, v, r, s);
    }

    struct Poll {
        address poapAddress;
        uint256 poapEventId;
    }

    //
    mapping(bytes32 => uint256) votes;

    uint256 pollCount = 1;
    mapping(uint256 => Poll) polls;

    function createPoll(address poapAddress, uint256 poapEventId) external {
        polls[pollCount] = Poll({
            poapAddress: poapAddress,
            poapEventId: poapEventId
        });
        pollCount++;
    }

    mapping(bytes32 => bool) poapHasVotedPoll;

    function getVoterPOAP(
        address voter,
        address poapAddress,
        uint256 poapEventId,
        uint256 pollId
    ) internal returns (uint256) {
        uint256 balance = ERC721(poapAddress).balanceOf(voter);
        uint256 _tokenId = 0;
        for (uint256 i = 0; i < balance && _tokenId == 0; i++) {
            (uint256 tokenId, uint256 eventId) = IXPoap(poapAddress)
                .tokenDetailsOfOwnerByIndex(voter, i);

            if (
                eventId == poapEventId &&
                !poapHasVotedPoll[getPoapPollHash(poapAddress, tokenId, pollId)]
            ) {
                _tokenId = tokenId;
            }
        }

        return _tokenId;
    }

    function getPoapPollHash(
        address poapAddress,
        uint256 poapTokenId,
        uint256 pollId
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(poapAddress, poapTokenId, pollId));
    }

    function getPollAnswerHash(uint256 poll, uint8 answer)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(poll, answer));
    }

    function addVote(
        Vote calldata vote,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        address voter = getAddress(vote, v, r, s);
        Poll storage p = polls[vote.poll];

        uint256 poapTokenId = getVoterPOAP(
            voter,
            p.poapAddress,
            p.poapEventId,
            vote.poll
        );

        require(poapTokenId > 0, "you need 1 POAP at least");

        votes[getPollAnswerHash(vote.poll, vote.answer)]++;

        poapHasVotedPoll[
            getPoapPollHash(p.poapAddress, poapTokenId, vote.poll)
        ] = true;
    }

    function getAnswersCount(uint256 pollId, uint8 answer)
        external
        view
        returns (uint256)
    {
        return votes[getPollAnswerHash(pollId, answer)];
    }
}
