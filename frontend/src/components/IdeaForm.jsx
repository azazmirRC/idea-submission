import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const IdeaForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [ideaDesc, setIdeaDesc] = useState("");
    const [file, setFile] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [timer, setTimer] = useState(120); // 2-minute countdown
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let interval;
        if (showCodeInput && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setShowCodeInput(false);
            setErrorMessage("Verification code expired. Request a new one.");
        }
        return () => clearInterval(interval);
    }, [showCodeInput, timer]);

    const sendVerificationCode = async () => {

      if (!email.endsWith("@royalcyber.com")) {
        setErrorMessage("Only @royalcyber.com emails are allowed.");
        return;
    }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/send-verification-code`, { email });
            setShowCodeInput(true);
            setTimer(120);
            setErrorMessage("");
            setSuccessMessage(response.data.message);
        } catch (error) {
            setErrorMessage("Failed to send verification code.");
        }
    };

    const verifyCode = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/verify-code`, { email, code: verificationCode });
            setIsVerified(true);
            setShowCodeInput(false);
            setSuccessMessage(response.data.message);
        } catch (error) {
            setErrorMessage("Invalid verification code.");
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
        setErrorMessage("Please verify your email before submitting.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("ideaDesc", ideaDesc);
    formData.append("file", file);

    try {
        await axios.post(`${API_BASE_URL}/api/ideas`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        setSuccessMessage("Idea Submitted Successfully! ✅");
        setTimeout(() => setSuccessMessage(""), 3000);
        setErrorMessage("");

        // ✅ Reset form fields
        setName("");
        setEmail("");
        setIdeaDesc("");
        setFile(null);
        setVerificationCode("");
        
        // ✅ Reset verification-related states
        setShowCodeInput(false);
        setIsVerified(false);
        setTimer(120);

        // ✅ Clear file input field manually
        document.getElementById("fileInput").value = "";
    } catch (error) {
        setErrorMessage("Failed to submit idea. Please try again.");
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Submit Your Idea</h2>

                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input type="text" placeholder="Name" className="p-2 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />

                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isVerified} // Disable email field after verification
                    />

                    {!isVerified && (
                        <button type="button" onClick={sendVerificationCode} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                            {showCodeInput ? "Resend Code" : "Verify Email"}
                        </button>
                    )}

                    {showCodeInput && (
                        <div className="flex flex-col space-y-2">
                            <input type="text" placeholder="Enter Verification Code" className="p-2 border rounded-md" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                            <button type="button" onClick={verifyCode} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Submit Code</button>
                            <p className="text-gray-500 text-sm">Code expires in: {timer}s</p>
                        </div>
                    )}

                    <textarea placeholder="Describe your idea" className="p-2 border rounded-md h-24" value={ideaDesc} onChange={(e) => setIdeaDesc(e.target.value)} required></textarea>

                    <input type="file" id="fileInput" className="p-2 border rounded-md" onChange={(e) => setFile(e.target.files[0])} />

                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" disabled={!isVerified}>
                        Submit Idea
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IdeaForm;
