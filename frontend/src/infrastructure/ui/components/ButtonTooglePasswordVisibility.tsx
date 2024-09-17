import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"

interface ButtonTooglePasswordVisibilityProps {
    showPassword: boolean;
    togglePasswordVisibility: () => void;
  }

  export const ButtonTooglePasswordVisibility: React.FC<ButtonTooglePasswordVisibilityProps> = ({
    showPassword,
    togglePasswordVisibility,
  }) => {
    return (
        <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
        >
            {showPassword ? <EyeOpenIcon className="w-5 h-5" /> : <EyeNoneIcon className="w-5 h-5" />}
        </button>
    )
}