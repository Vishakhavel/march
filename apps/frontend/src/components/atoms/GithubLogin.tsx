"use client"

import useGitHubLogin from "@/src/hooks/useGithubLogin"
import { Github } from "@/src/lib/icons/Github"

export const GithubLogin = (): JSX.Element => {
  const handleLogin = useGitHubLogin()

  return (
    <button
      onClick={handleLogin}
      className="flex w-96 items-center justify-center gap-x-6 rounded-2xl border border-button-stroke bg-transparent p-3 font-semibold text-black"
    >
      <Github />
      <span className="pr-1">Continue with github</span>
    </button>
  )
}