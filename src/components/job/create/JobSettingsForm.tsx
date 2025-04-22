import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobSettingsFormProps {
  settings: {
    isRemote: boolean
    isHybrid: boolean
    isOnsite: boolean
    salaryMin: number
    salaryMax: number
    salaryCurrency: string
    salaryPeriod: string
    experienceLevel: string
    employmentType: string
    visaSponsorship: boolean
    relocationAssistance: boolean
  }
  onSettingsChange: (settings: JobSettingsFormProps['settings']) => void
}

export function JobSettingsForm({ settings, onSettingsChange }: JobSettingsFormProps) {
  const handleChange = (field: keyof JobSettingsFormProps['settings'], value: any) => {
    onSettingsChange({
      ...settings,
      [field]: value
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Work Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Work Location</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={settings.isRemote}
                onCheckedChange={(checked) => handleChange('isRemote', checked)}
              />
              <Label htmlFor="remote">Remote</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="hybrid"
                checked={settings.isHybrid}
                onCheckedChange={(checked) => handleChange('isHybrid', checked)}
              />
              <Label htmlFor="hybrid">Hybrid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="onsite"
                checked={settings.isOnsite}
                onCheckedChange={(checked) => handleChange('isOnsite', checked)}
              />
              <Label htmlFor="onsite">On-site</Label>
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Salary Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum</Label>
              <Input
                id="salaryMin"
                type="number"
                value={settings.salaryMin}
                onChange={(e) => handleChange('salaryMin', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum</Label>
              <Input
                id="salaryMax"
                type="number"
                value={settings.salaryMax}
                onChange={(e) => handleChange('salaryMax', Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.salaryCurrency}
                onValueChange={(value) => handleChange('salaryCurrency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={settings.salaryPeriod}
                onValueChange={(value) => handleChange('salaryPeriod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Job Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                value={settings.experienceLevel}
                onValueChange={(value) => handleChange('experienceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={settings.employmentType}
                onValueChange={(value) => handleChange('employmentType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Additional Benefits</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="visa"
                checked={settings.visaSponsorship}
                onCheckedChange={(checked) => handleChange('visaSponsorship', checked)}
              />
              <Label htmlFor="visa">Visa Sponsorship</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="relocation"
                checked={settings.relocationAssistance}
                onCheckedChange={(checked) => handleChange('relocationAssistance', checked)}
              />
              <Label htmlFor="relocation">Relocation Assistance</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 