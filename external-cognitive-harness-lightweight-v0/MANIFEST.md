# One-read Harness prototype manifest

Status: PROTOTYPE PROVENANCE — NOT ACTIVATED

Source commit: `e1d483fdea6de64c6672421b7e63af5a74f82cca`

Source blobs:
- `external-cognitive-harness-v0/ENTRY.md`: `4c7dfb6ae547cbfdc93afdc9f459441d8657146b`
- `external-cognitive-harness-v0/FRAME.md`: `011cd91f925eb25c1a66646143e4a26af9750c29`
- `external-cognitive-harness-v0/REVIEW.md`: `8b5b25caef81f56b0417ddf7d6a243aa8c8b3447`
- `external-cognitive-harness-v0/SYNTHESIZE.md`: `2325a6368b98c3dcb589985592357499a0f6898a`

Compiler:
- `external-cognitive-harness-lightweight-v0/build_compiled.py`

Generated artifact:
- `external-cognitive-harness-lightweight-v0/COMPILED.md`
- compiled blob SHA: `34baa153501215fe4cdb54ecf3c45a758c35372e`

Invariant: the generated artifact embeds the four source file contents without changing their cognitive rules. The additional file-resolution contract only redirects embedded cross-file references to embedded sections so the Harness can be invoked with one external read.

No behavioral efficacy or equivalence claim has been made yet.
