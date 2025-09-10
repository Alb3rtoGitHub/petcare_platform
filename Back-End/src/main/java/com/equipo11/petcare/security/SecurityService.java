package com.equipo11.petcare.security;

import com.equipo11.petcare.model.user.User;

public interface SecurityService {
    User verifyUserOrToken(Long targetId);
    void creatorClaimVerify(User claimUser);
    User userAuthenticate();
}
